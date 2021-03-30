import {AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {IFormElement, IFormOptions} from '../../shared/models/form-element.model';
import {DataService} from '../../shared/services/data-service/data-service.service';
import {ComboService} from '../../shared/services/combo-service/combo.service';
import {MapToService} from '../../shared/services/map-to.service';
import {ResetOnChangeService} from '../../shared/services/reset-on-change.service';
import {ValueService} from '../../shared/services/value/value.service';
import {MatSelect} from '@angular/material/select';

@Component({
    selector: 'mrf-combo-element',
    templateUrl: './combo-element.component.html',
    styleUrls: ['./combo-element.component.scss']
})
export class ComboElementComponent implements OnInit, AfterContentChecked {
    @Input() field: IFormElement;
    @Input() formRef: NgForm;
    @Input() readOnly: boolean;

    @ViewChild(MatSelect) private select: MatSelect;

    private valueField = 'value';
    private labelField = 'label';
    /**
     * L'etichetta da rappresentare
     */
    public displayLabel: string;
    public displayLegend: string;


    public comboElements: IFormOptions[] = [];
    private options: any[];

    /**
     * Conserviamo il precedente valore booleano di visibilità
     * per conoscere il momento in cui cambia
     */
    private componentWasVisible: boolean;

    constructor(
        private dataService: DataService,
        private translatable: TranslatablePipe,
        private comboService: ComboService,
        private resetOnChangeService: ResetOnChangeService,
        private mapToService: MapToService,
        private changeDetectorRef: ChangeDetectorRef,
        private valueService: ValueService
    ) {
    }

    /**
     * @description Add description
     */
    ngOnInit() {
        if (!this.field) {
            return;
        }
        this.valueField = this.field.valueProperty || this.valueField;
        this.labelField = this.field.labelProperty || this.labelField;
        this.field.valueProperty = this.valueField;
        this.field.labelProperty = this.labelField;
        this.field.suffix = this.field.suffix || '';

        /**
         * Calcolo l'etichetta da rappresentare in base ai valori di label e hideLabel
         */
        if (!!this.field.hideLabel) {
            this.displayLabel = '';
            this.displayLegend = null;
        } else {
            this.displayLabel = this.translatable.transform(this.field.label);
            this.displayLegend = this.translatable.transform(this.field.legend);

        }
        if (!!this.field.data && !!this.field.data.configurableParams) {
            const configurableParams = this.field.data.configurableParams;
            Object.keys(configurableParams).forEach(v => {
                if (configurableParams[v] !== '') {
                    this.resetOnChangeService.registerRule(configurableParams[v], this.field.key);
                    this.resetOnChangeService.resetFieldEvent.subscribe((e) => {
                        if (e.key === this.field.key) {
                            this.manageComboElements();
                        }
                    });
                }
            });
        }
        this.manageComboElements();
    }

    /**
     * @method manageComboElements
     * @description Add description
     */
    manageComboElements() {
        this.checkFieldDataValues();
        switch (this.field.dataSrc) {
            case 'url':
                this.manageUrlComboElements();
                break;
            case 'resource':
                // @todo al momento non lo supportiamo
                this.manageResourceComboElements();
                break;
            case 'values':
                this.manageValuesComboElements();
                break;
            default:
                this.setComboElements(this.field.data.values);
                console.warn(`[SELECT] ${this.field.key}: Unmanaged case ${this.field.dataSrc}`);
        }
    }

    /**
     * @method manageValuesComboElements
     * @description Add description
     */
    private manageValuesComboElements() {
        this.setComboElements(
            this.field.data.values.map(item => {
                return {
                    value: item[this.valueField],
                    label: item[this.labelField]
                };
            })
        );
    }

    /**
     * TODO - Implement method
     * @method manageResourceComboElements
     * @description Add description
     */
    private manageResourceComboElements() {
        this.comboService.collectionChange.subscribe(comboChanged => {
            if (comboChanged.key === this.field.key + this.field.suffix) {
                this.setComboElements(comboChanged.list);
            }
        });
        console.warn(this.field.key + ' dataSrc:"resource"  currently unsupported!');
    }

    /**
     * @method manageUrlComboElements
     * @description Add description
     */
    private manageUrlComboElements() {
        this.setComboElements([]);
        const params = {...this.field.data.params} || {};
        const configurableParams = {...this.field.data.configurableParams} || {};
        this.dataService.mergeParams(params, configurableParams, this.formRef);
        this.dataService
            .getResourceByMethod(this.field.data.url, this.field.data.method, params)
            .subscribe(
                (data: any[]) => {
                    const dataOptions: IFormOptions[] = [];
                    data.map((item: any) => {
                        dataOptions.push({
                            value: item[this.valueField],
                            label: this.translatable.transform(item[this.labelField])
                        });
                    });
                    this.setComboElements(dataOptions);
                    this.options = data;
                    this.comboService.unregisterComboWithRemoteData(this.field.key + this.field.suffix);
                },
                () => {
                    this.comboService.unregisterComboWithRemoteData(this.field.key + this.field.suffix);
                }
            );
    }

    /**
     * @method checkFieldDataValues
     * @description Add description
     */
    private checkFieldDataValues() {
        if (['url', 'values', 'resource'].indexOf(this.field.dataSrc) < 0) {
            if (!!this.field.data.url) {
                this.field.dataSrc = 'url';
            } else if (Array.isArray(this.field.data.values)) {
                this.field.dataSrc = 'values';
            }
        } else {
            this.options = [...this.field.data.values];
            this.setComboElements(
                this.field.data.values.map(item => {
                    return {
                        value: item[this.valueField],
                        label: item[this.labelField]
                    };
                })
            );
        }
    }

    /**
     * Funzionalita che permette di settare i valori definiti nelle key dell'oggetto mapFieldToFormKey
     * come valore degli idSemantici
     * @param data è l'oggetto selezionato
     */
    public optionSelectedEvent(data: any) {
        this.mapToService.optionSelectedEvent(this.field, data, this.formRef, this.options);
    }

    public isDisabled(): boolean {
        this.changeDetectorRef.markForCheck();
        if (!!this.field) {
            if (this.field.input) {
                return !!this.field.disabled;
            }
        }
        return !!this.readOnly;
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
    }


    private setComboElements(options: IFormOptions[] = []) {
        this.comboElements = JSON.parse(JSON.stringify(options));
        setTimeout(() => {
            if (!!this.field.defaultValue) {
                // this.select.value = this.field.defaultValue;
                const v = {};
                v[this.field.key + this.field.suffix] = this.field.defaultValue;
                this.formRef.setValue(v);
                // this.formRef.form.controls[this.field.key + this.field.suffix].setValue(this.field.defaultValue);
                // this.changeDetectorRef.detectChanges();
                // console.log('patate');
            }
        }, 50);
    }
}
