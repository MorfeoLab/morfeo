import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Input,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

import {IFormElement} from '../shared/models/form-element.model';
import {ConditionalService} from '../shared/services/conditional/conditional.service';
import {COMPONENT_RESOLVER, ComponentBase} from '../shared/constants/component-resolver.constants';
import {UtilityService} from '../shared/services/utility/utility.service';
import {ComboService} from '../shared/services/combo/combo.service';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'mrf-form-element',
    templateUrl: './form-element.component.html',
    styleUrls: ['./form-element.component.scss']
})
export class FormElementComponent implements OnInit {
    @ViewChild('componentPlaceholder', {
        static: true,
        read: ViewContainerRef
    }) public componentPlaceholder: ViewContainerRef;
    @Input() component: IFormElement;
    @Input() formRef: NgForm;
    @Input() externalData: { [key: string]: any };
    @Input() readOnly: boolean;

    public json = '';
    public displayMode: 'input' | 'output';

    constructor(
        private conditionalService: ConditionalService,
        private changeDetector: ChangeDetectorRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private utility: UtilityService,
        private comboService: ComboService
    ) {
    }

    ngOnInit(): void {
        if (!this.component || !this.componentPlaceholder) {
            return;
        }
        this.component.defaultValue = this.component.defaultValue || null;
        this.component.validate = this.component.validate || {};
        this.component.validate.custom = this.component.validate.custom === '[]' ? '' : this.component.validate.custom || '';
        this.component.input = true;

        if (this.utility.isNullOrUndefined(this.formRef)) {
            /**
             * in questo punto sono certo che questo componente è orfano
             * bisogna gestire il fatto che questo componente non deve eseguire
             * nessuna regola JSON_LOGIC per evitare errori nell'editor BDM
             */
            this.component.input = false;
            this.formRef = new NgForm(null, null);
        }
        this.displayMode = 'input';
        if (this.component.displayMode === 'output') {
            this.displayMode = 'output';
        }

        this.component.validate = this.component.validate || {};
        this.component.data = this.component.data || {};

        if (this.component.multiple && this.component.input) {
            const componentClone = Object.assign({}, this.component);
            componentClone.multiple = false;

            this.component = {
                label: componentClone.label,
                type: 'repeatable',
                key: 'repeatable_' + componentClone.key,
                displayMode: componentClone.displayMode,
                components: [
                    {type: 'columns', columns: [{components: [componentClone]}]}
                ],
                conditional: Object.assign({}, componentClone.conditional)
            };
            componentClone.conditional = {};
        }

        const componentResolver = COMPONENT_RESOLVER[this.component.type];
        /**
         * Alcuni componenti hanno la necessità di caricare dati da remoto
         * non possiamo considerare completo il form fino a quando tutti
         * questi componenti hanno completato il caricamento.
         */
        if (this.component.dataSrc === 'url') {
            if (['select', 'selectboxes'].includes(this.component.type)) {
                if (this.displayMode === 'input') {
                    if (!!this.component.data && this.component.data.url && typeof this.component.data.url === 'string') {
                        this.comboService.registerComboWithRemoteData(this.component.key + this.component.suffix);
                    }
                }
            }
        }
        if (this.utility.isNullOrUndefined(componentResolver)) {
            console.warn(`Non trovato component resolver per ${this.component.type}.`);
            return;
        }
        const componentClass = componentResolver[this.displayMode];
        if (this.utility.isNullOrUndefined(componentClass)) {
            console.warn(`Non esiste nessun display per il componente ${this.component.type} con valore ${this.displayMode}`);
            return;
        }

        const child = this
            .componentPlaceholder
            .createComponent(
                this
                    .componentFactoryResolver
                    .resolveComponentFactory(componentClass)
            );

        (child.instance as ComponentBase).field = this.component;
        (child.instance as ComponentBase).formRef = this.formRef;
        (child.instance as ComponentBase).externalData = this.externalData;
        (child.instance as ComponentBase).readOnly = !!this.component.readOnly || !!this.readOnly;

        if (this.isInput(this.component)) {
            this.component.disabled = this.fixStringBoolean(this.component.disabled);
            this.component.validate.required = this.fixStringBoolean(this.component.validate.required);


            /**
             * JsonLogic per disabilitare
             */
            if (this.utility.isJSON(this.component.disabled)) {
                this.conditionalService.registerJsonRule(
                    this.formRef,
                    this.component,
                    (this.component.disabled as string),
                    this.externalData,
                    (v) => {
                        const valid = v.reduce((a, b) => {
                            return !!a && !!b;
                        });
                        if (this.component.disabled !== valid) {
                            this.component.disabled = !!valid;
                        }
                    }
                );
            }

            /**
             * JsonLogic per required
             */
            if (this.utility.isJSON(this.component.validate.required)) {
                this.conditionalService.registerJsonRule(
                    this.formRef,
                    this.component,
                    (this.component.validate.required as string),
                    this.externalData,
                    (v: boolean[]) => {
                        const valid = v.reduce((a, b) => {
                            return !!a && !!b;
                        });
                        if (this.component.validate.required !== valid) {
                            this.component.validate.required = !!valid;
                        }
                    }
                );
            }
        } /// if (this.isInput(this.component))
        /**
         * JsonLogic per il valore predefinito
         */
        if (this.utility.isJSON(this.component.calculatedValue)) {
            this.conditionalService.registerJsonRule(
                this.formRef,
                this.component,
                (this.component.calculatedValue as string),
                this.externalData,
                (v) => {
                    if (Array.isArray(v)) {
                        if (v.length === 1 && typeof v[0] === 'boolean') {
                            v = v[0];
                        } else {
                            v = v.join('');
                        }
                    }
                    if (String(v) === 'NaN') {
                        v = '';
                    }
                    if (!!this.formRef.controls[this.component.key + this.component.suffix]) {
                        this.formRef.controls[this.component.key + this.component.suffix].setValue(v);
                        this.formRef.controls[this.component.key + this.component.suffix].markAsTouched({onlySelf: true});
                    }
                },
                false
            );
        }
        /**
         * Questo è necessario per evitare l'errore ValueChangedAfterViewInit
         */
        this.changeDetector.detectChanges();
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
     * Utilizzata per distinguere i componenti di input dai componenti di altra natura
     */
    isInput(comp: IFormElement) {
        return [
            'autocomplete',
            'button',
            'checkbox',
            'chips',
            'datetime',
            'email',
            'file',
            'jsonRule',
            'jsonRulesList',
            'map',
            'mapHtml',
            'multiLang',
            'number',
            'objectList',
            'objectList2',
            'password',
            'phoneNumber',
            'radio',
            'select',
            'selectboxes',
            'textarea',
            'textfield',
            'image',
        ].includes(comp.type);
    }
}
