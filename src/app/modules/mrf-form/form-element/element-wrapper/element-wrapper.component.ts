import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewRef} from '@angular/core';
import {IFormElement} from '../../shared/models/form-element.model';
import {NgForm} from '@angular/forms';
import {ConditionalService} from '../../shared/services/conditional/conditional.service';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {ValueService} from '../../shared/services/value/value.service';

/**
 * Questo componente contiene tutta la logica di visibilità
 * In precedenza questa logica si trovava all'interno di
 * FormElementComponent, ma era più difficile da gestire
 */
@Component({
    selector: 'mrf-element-wrapper',
    templateUrl: './element-wrapper.component.html',
    styleUrls: ['./element-wrapper.component.scss']
})
export class ElementWrapperComponent implements OnInit, AfterViewInit {
    @Input() component: IFormElement;
    @Input() formRef: NgForm;
    @Input() externalData: { [key: string]: any };
    @Input() readOnly: boolean;

    private oldHiddenValue = false;

    constructor(
        private conditional: ConditionalService,
        private changeDetector: ChangeDetectorRef,
        private utility: UtilityService,
        private valueService: ValueService
    ) {
    }

    ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
    }

    ngOnInit() {
      if (this.component.key.indexOf('.')>= 0) {
        console.warn(`[WARN] Please avoid using dot in element keys to keep json_logic compatibility (${this.component.key}).`);
      }
        /**
         * La string "false" deve essere valutata come booleano false
         */
        this.component.hidden = this.fixStringBoolean(this.component.hidden);

        /**
         * Se la regola jsonLogic non contiene variabili la valutiamo una volta sola
         */
        this.component.hidden = this.fixJsonRuleStatic(this.component.hidden);

        /**
         * Il valore di suffix è talvolta undefined
         */
        this.component.suffix = this.utility.isNullOrUndefined(this.component.suffix) ? '' : String(this.component.suffix);

        /**
         * JsonLogic per nascondere - Non soltanto per gli input
         */
        if (this.isJsonLogic(this.component.hidden)) {
            this.component.input = true;
            this.conditional.registerJsonRule(
                this.formRef,
                this.component,
                (this.component.hidden as string),
                this.externalData,
                (v) => {
                    for (const valid of v) {
                        if (!valid) {
                            /**
                             * Alcuni controlli, come ad esempio il Chips,
                             * mantengono il valore anche dopo essere stati nascosti.
                             * Questo rappresenta un problema perché se il campo
                             * diventa nuovamente visibile riproprone il vecchio valore.
                             */
                            // if (this.oldHiddenValue) {
                            //   if (this.formRef.controls.hasOwnProperty(this.component.key + this.component.suffix)) {
                            //     this.formRef.controls[this.component.key + this.component.suffix].reset();
                            //   }
                            // }
                            this.component.hidden = false;
                            this.oldHiddenValue = false;
                            if (!(this.changeDetector as ViewRef).destroyed) {
                                this.changeDetector.detectChanges();
                            }
                            return;
                        }
                        this.component.hidden = true;
                        this.oldHiddenValue = true;
                        if (!(this.changeDetector as ViewRef).destroyed) {
                            this.changeDetector.detectChanges();
                        }
                    }
                }
            );
        }

        if (!!this.component.conditional) {
            this.conditional.registerRule(this.formRef, this.component, this);
        }
    }

    fixJsonRuleStatic(rule: any) {
        if (this.utility.isNullOrUndefined(rule)) {
            return false;
        }
        if (this.isJsonLogic(rule)) {
            if (!String(rule).includes('var')) {
                return this.conditional.applyJsonLogic(rule, {});
            } else {
                return rule;
            }
        }
        return !!rule;
    }

    /**
     * Converte
     */
    fixStringBoolean(value: any): boolean | string {
        if (typeof value === 'string') {
            switch (value) {
                case 'true':
                    return true;
                case 'false':
                    return false;
            }
        }
        return value;
    }

    /**
     * verifica se un parametro è JsonLogic
     */
    isJsonLogic(prop: any): boolean {
        if (typeof prop === 'string') {
            if (this.utility.isJSON(prop)) {
                return true;
            }
        }
        return false;
    }


    /**
     * Questa funzione viene richiamata da ConditionalService per la gestione
     * della logica dentro component.conditional.json
     * Deve essere rimossa.
     */
    setVisibility(visible: boolean) {
        this.component.hidden = !visible;
        this.changeDetector.markForCheck();
        // if (!(this.changeDetector as ViewRef).destroyed) {
        //   this.changeDetector.detectChanges();
        // }
    }

    public isVisible() {
        return !(this.component.input && this.component.hidden);
    }

}
