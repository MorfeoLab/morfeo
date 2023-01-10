import {
    AfterContentChecked, AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {AbstractControl, NgForm, NgModel} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {ValueService} from '../../shared/services/value/value.service';
import {Moment} from 'moment';
import {DatepickerService} from '../../shared/services/datepicker/datepicker.service';
import {UtilityService} from '../../shared/services/utility/utility.service';


@Component({
    selector: 'mrf-date-element',
    templateUrl: './date-element.component.html',
    styleUrls: ['./date-element.component.scss'],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'it-IT'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class DateElementComponent implements OnInit, AfterContentChecked, AfterViewInit {
    @Input() field: IFormElement;
    @Input() formRef: NgForm;
    @Input() readOnly: boolean;

    @ViewChild('inputElement') private inputElement: AbstractControl;
    @ViewChild('hiddenElement') private hiddenElement: NgModel;
    @ViewChild('dateTimePickerElement') private dateTimePickerElement: ElementRef;
    private dateTimePickerElementValue;

    /**
     * Conserviamo il precedente valore booleano di visibilità
     * per conoscere il momento in cui cambia
     */
    private componentWasVisible: boolean;
    inputElementModel: any = '';

    /**
     * L'etichetta da rappresentare
     */
    public displayLabel: string;

    constructor(
        private translatable: TranslatablePipe,
        private valueService: ValueService,
        private datepickerService: DatepickerService,
        private utils: UtilityService
    ) {
    }

    ngOnInit() {
        if (!this.field) {
            return;
        }
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

    /**
     * Se l'elemento è nascosto deve perdere il valore
     */
    ngAfterContentChecked() {
        /// Se il componente è appena comparso ricarica il valore dal form
        const componentIsVisible = this.valueService.isVisible(this.field);
        const componentId = this.field.key + this.field.suffix;
        if (componentIsVisible) {
            if (!this.componentWasVisible) {
                /// Componente appena comparso
            }
        } else {
            if (this.componentWasVisible) {
                /// Componente appena nascosto
                const componentCount = this.valueService.visibleCount;
                if (!componentCount[componentId]) {
                    /// Non ci sono altri controlli con lo stesso nome
                    if (this.formRef.controls.hasOwnProperty(componentId)) {
                        this.formRef.controls[componentId].setValue(null, {
                            onlySelf: true,
                            emitEvent: false
                        });
                    }
                }
            }
        }
        this.componentWasVisible = !!componentIsVisible;

        /// Tiene traccia del valore del componente dateTimePicker se presente
        if (this.dateTimePickerElement) {
            if (this.dateTimePickerElement.nativeElement.value !== this.dateTimePickerElementValue) {
                this.dateTimePickerElementValue = this.dateTimePickerElement.nativeElement.value;
                this.tryToSetHiddenValue(this.dateTimePickerElementValue);
            }
        }
    }

    ngAfterViewInit() {
        if (!!this.field.defaultValue) {
            const dateValue = new Date(String(this.field.defaultValue));
            if (this.utils.isValidDate(dateValue)) {
                if (this.field.timePicker) {
                    this.inputElementModel = this.formatDateForTimePicker(dateValue);
                } else {
                    this.inputElementModel = dateValue;
                }
            } else {
                this.formRef.controls[this.field.key + this.field.suffix].setValue(null);
                this.inputElementModel = null;
            }
        }
        if (this.field.timePicker) {
          // questo serve quando un qualsiasi componente che include il form fa setValue, in quel caso l'input element necessita
          // la conversione del formato della data per mostrare il campo precompilato
            this.formRef.controls[this.field.key + this.field.suffix].valueChanges.subscribe(e => {
                if (!this.utils.isNullOrUndefined(e)) {
                    const asDate = new Date(e);
                    const formattedValue = this.formatDateForTimePicker(asDate);
                    //console.log(this.inputElementModel, formattedValue, this.inputElementModel !== formattedValue);
                    if(this.inputElementModel !== formattedValue) {
                        this.inputElementModel = formattedValue;
                    }
                }
            });
        }

        if ((!!this.field.input && !!this.field.disabled) || this.readOnly) {
            this.formRef.controls[this.field.key + this.field.suffix].valueChanges.subscribe(e => {
                if (this.utils.isNullOrUndefined(e)) {
                    e = null;
                }
                this.inputElementModel = e;
            });
        }
    }

    public myFilter = (d: any): boolean => {
        if (!d) {
            return true;
        }
        const myFilter = this.datepickerService.getFilter(this.field.filter);
        if (!myFilter) {
            return true;
        }
        if (d.hasOwnProperty('getDay')) {
            /// d is Date already
            return myFilter(d as Date);
        }
        return myFilter((d as Moment).toDate());
    };

    /**
     * Utilizzato solo nel caso di timePicker = true
     */
    public changedDateTimePickerValue($event) {
        this.tryToSetHiddenValue($event.target.value);
    }

    private tryToSetHiddenValue(val) {
        // set timeout perchè senza da errore "Expression has changed after it was checked"
        setTimeout(() => {
            //console.log(val);
            // facendo questa cosa si perde il fuso orario corretto
            /*if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
                val = val + ':00.000Z';
            }*/
            const asDate = new Date(val);
            if (this.utils.isValidDate(asDate)) {
                this.formRef.controls[this.field.key + this.field.suffix].setValue(asDate.toJSON());
            } else {
                this.formRef.controls[this.field.key + this.field.suffix].setValue(null);
            }
        });
    }

    /**
     * non va fatto asDate.toJSON().substr(0, 16), non tiene conto del fuso orario
     * @param date
     * @private
     */
    private formatDateForTimePicker(date: Date) {
        let result = ''+ date.getFullYear();
        result += '-';
        let month = date.getMonth() + 1;
        if (month < 10) {
            result += '0';
        }
        result += month;
        result += '-';
        if (date.getDate() < 10) {
            result += '0';
        }
        result += date.getDate();
        result += 'T';
        if (date.getHours() < 10) {
            result += '0';
        }
        result += date.getHours();
        result += ':';
        if (date.getMinutes() < 10) {
            result += '0';
        }
        result += date.getMinutes();
        return result;
    }
}
