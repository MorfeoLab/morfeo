import {FormControl, NgForm} from '@angular/forms';
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {IFormElement, IFormOptions} from '../../shared/models/form-element.model';
import {Subscription} from 'rxjs';
import {AVAILABLE_LANGUAGES} from '../../shared/models/languages.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {UtilityService} from '../../shared/services/utility/utility.service';

@Component({
    selector: 'mrf-map-element',
    templateUrl: './map-element.component.html',
    styleUrls: ['./map-element.component.scss']
})
export class MapElementComponent implements OnInit, AfterViewInit {
    /**
     * Modello JSON per il disegno del campo
     */
    @Input() field: IFormElement;


    @Input() readOnly: boolean;

    /**
     * Riferimento al form che contiene questo controllo
     */
    @Input() formRef: NgForm;

    /**
     * Elenco delle opzioni disponibili per la combo
     */
    comboElements: IFormOptions[];
    /**
     * Text field
     */
    valueText: FormControl;
    valueTextSubscription: Subscription;
    defaultComboValue: string;

    /**
     * Select field
     */
    valueSelect: FormControl;
    valueSelectSubscription: Subscription;

    /**
     * Form che contiene select e testo
     */
    valuesForm: NgForm;

    /**
     * Hidden field for real value
     */
    hiddenControl: FormControl;
    hiddenControlVal: any = {};

    /**
     * L'etichetta da rappresentare
     */
    public displayLabel: string;

    constructor(
        private translatable: TranslatablePipe,
        private utility: UtilityService
    ) {
    }

    ngOnInit() {
        if (!this.field) {
            return;
        }
        /**
         * Creo un form fittizio, mi serve per intercettare le modifiche
         */
        this.valuesForm = new NgForm(null, null);
        /**
         * Setto la lingua italiana come valore iniziale
         */
        this.comboElements = this.field.values || AVAILABLE_LANGUAGES;
        this.defaultComboValue = this.comboElements[0].value;
        /**
         * Se il suffix non è impostato poi ci troviamo "undefined"
         */
        this.field.suffix = this.field.suffix || '';

        /**
         * Calcolo l'etichetta da rappresentare in base ai valori di label e hideLabel
         */
        if (!!this.field.hideLabel) {
            this.displayLabel = '';
        } else {
            this.displayLabel = this.translatable.transform(this.field.label);
        }
    }

    ngAfterViewInit(): void {
        /**
         * Recupero un riferimento all'AbstractControl della casella di testo per l'autocomplete
         */
        this.valueText =
            this.valueText || (this.valuesForm.controls.valueText as FormControl);

        /**
         * Recupero un riferimento all'AbstractControl della casella di testo per l'autocomplete
         */
        this.valueSelect =
            this.valueSelect || (this.valuesForm.controls.valueSelect as FormControl);

        /**
         * Recupero un riferimento all'AbstractControl dell'input hidden
         */
        this.hiddenControl =
            this.hiddenControl ||
            (this.formRef.controls[
            this.field.key + this.field.suffix
                ] as FormControl);

        /**
         * Registra un listenere per le modifiche ai campi visibili
         */
        this.registerVisibleFieldsListener();

        /**
         * Registra un listener per il campo hidden
         */
        this.registerHiddenFieldListener();
    }

    registerHiddenFieldListener() {
        if (!!this.hiddenControl) {
            this.hiddenControl.valueChanges.subscribe(v => {
                if (this.utility.isNullOrUndefined(v)) {
                    v = {};
                    for (const option of this.comboElements) {
                        v[option.value] = v[option.value] || '';
                    }
                    this.hiddenControl.setValue(v, {onlySelf: true, emitEvent: false});
                    return;
                }
                for (const lang in v) {
                    if (v.hasOwnProperty(lang)) {
                        this.valueSelect.setValue(lang);
                        return;
                    }
                }
            });
        }
    }

    registerVisibleFieldsListener() {
        if (this.valueSelect) {
            this.valueSelectSubscription =
                this.valueSelectSubscription ||
                this.valueSelect.valueChanges.subscribe(value => {
                    let newTextValue = '';
                    if (this.hiddenControlVal.hasOwnProperty(value)) {
                        newTextValue = this.hiddenControlVal[value];
                    }
                    this.valueText.setValue(newTextValue);
                });
        }
        if (this.valueText) {
            this.valueTextSubscription =
                this.valueTextSubscription ||
                this.valueText.valueChanges.subscribe((value: string) => {
                    const selectedLanguage = this.valueSelect.value;
                    if (this.hiddenControlVal === '') {
                        this.hiddenControlVal = {};
                    }
                    if (this.hiddenControlVal === '') {
                        this.hiddenControlVal = {};
                    }
                    this.hiddenControlVal[selectedLanguage] = value;
                });
        }
    }
}
