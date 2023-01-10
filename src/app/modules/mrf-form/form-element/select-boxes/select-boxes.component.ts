import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {DataService} from '../../shared/services/data/data.service';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {ComboService} from '../../shared/services/combo/combo.service';
import {ResetOnChangeService} from '../../shared/services/reset-on-change.service';
import {MapToService} from '../../shared/services/map-to.service';
import {ValueService} from '../../shared/services/value/value.service';
import {IFormElement, IFormOptions} from '../../shared/models/form-element.model';
import {NgForm, NgModel} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {Subscription} from 'rxjs';

@Component({
    selector: 'mrf-select-boxes',
    templateUrl: './select-boxes.component.html',
    styleUrls: ['./select-boxes.component.scss']
})
export class SelectBoxesComponent implements OnInit, AfterContentChecked, AfterViewInit, OnDestroy {

    public labelIsBlank = false;
    @ViewChildren(MatCheckbox) private checkboxList;
    private externalChangeSubscription: Subscription;

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
     * Modello JSON per il disegno del campo
     */
    @Input() field: IFormElement;

    /**
     * Flag sola lettura
     */
    @Input() readOnly: boolean;

    /**
     * Riferimento al form che contiene questo controllo
     */
    @Input() formRef: NgForm;

    @ViewChild(MatSelect) private select: MatSelect;
    @ViewChild('fullValue') private fullValueModel: NgModel;

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

    private oldValue: any;

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

        this.labelIsBlank = !this.field.label;

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

        // per retrocompatibilità
        if (this.field.values && this.field.values.length > 0) {
            this.field.data.values = this.field.values;
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

    ngAfterViewInit() {
        this.subscribeToExternalChange();
    }

    ngOnDestroy() {
        if (!!this.externalChangeSubscription) {
            this.externalChangeSubscription.unsubscribe();
            this.externalChangeSubscription = null;
        }
    }

    public selectOption() {
        if (this.formRef && this.formRef.controls && this.formRef.controls[this.field.key + this.field.suffix]) {
            this.optionSelectedEvent();
        }
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
                this.setComboElements(this.field.data.values as IFormOptions[]);
                console.warn(`[SELECT] ${this.field.key}: Unmanaged case ${this.field.dataSrc}`);
        }
        this.subscribeToCollectionChange();
    }

    /**
     * @method manageValuesComboElements
     * @description Add description
     */
    private manageValuesComboElements() {
        this.setComboElements(
            this.field.data.values
        );
    }

    /**
     * TODO - Implement method
     * @method manageResourceComboElements
     * @description Add description
     */
    private manageResourceComboElements() {
        console.warn(this.field.key + ' dataSrc:"resource"  currently unsupported!');
    }

    /**
     * @method manageUrlComboElements
     * @description Add description
     */
    private manageUrlComboElements() {
        this.setComboElements([]);
        let finalUrl = this.field.data.url;
        const staticParams = {...this.field.data.params} || {};
        const configurableParams = {...this.field.data.configurableParams} || {};
        this.dataService.mergeParams(staticParams, configurableParams, this.formRef);
        /**
         * I parametri il cui nome inizia per $ sono pathParams, gli altri sono queryParams
         */
        const params: { [key: string]: string } = {};
        for (const paramName in staticParams) {
            if (staticParams.hasOwnProperty(paramName)) {
                const paramValue = staticParams[paramName];
                if (paramName.charAt(0) === '$') {
                    finalUrl = this.field.data.url.split(paramName).join(String(paramValue));
                } else {
                    params[paramName] = paramValue;
                }
            }
        }
        this.dataService
            .getResourceByMethod(finalUrl, this.field.data.method, params)
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

    private subscribeToCollectionChange() {
        this.comboService.collectionChange.subscribe(comboChanged => {
            if (comboChanged.key === this.field.key + this.field.suffix) {
                this.setComboElements(comboChanged.list);
            }
        });
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
            this.field.data.values = this.field.data.values || [];
            const {values} = this.field.data;
            this.options = [...values];
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

    public optionSelectedEvent(skipSetValue = false) {
        const value = this.getCheckedValues();
        if (!skipSetValue) {
            /// Salva il valore nel campo del form
            this.formRef.controls[this.field.key + this.field.suffix].setValue(value);
        }

        if (this.field.fullValue) {
            if (this.formRef.controls.hasOwnProperty(this.field.key + '-fullValue' + this.field.suffix)) {
                const fullValueControlName = this.field.key + '-fullValue' + this.field.suffix;
                const fullValueControlValue = this.options.filter(item => value.includes(item[this.valueField]));
                const setData = {};
                setData[fullValueControlName] = fullValueControlValue;

                this.formRef.form.patchValue(setData);
            }
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
    }


    private setComboElements(options: any[] = []) {
        this.options = options;
        this.comboElements = JSON.parse(JSON.stringify(options.map(
            item => {
                return {
                    label: item.label,
                    value: item.value
                };
            }
        )));
        setTimeout(() => {
            if (!!this.field.defaultValue) {
                const v = {};
                v[this.field.key + this.field.suffix] = this.field.defaultValue;
                this.formRef.setValue(v);
            }
        }, 50);
    }

    public toggleSelectAll($event: MatCheckboxChange) {
        this.checkboxList.forEach((cb: MatCheckbox) => {
            if (cb.name !== 'toggle-select-all') {
                cb.checked = $event.checked;
            }
        });
        this.optionSelectedEvent();
    }

    public changedCheckbox() {
        console.log('changedCheckbox');
    }

    private getCheckedValues() {
        const value = [];
        let allChecked = true;
        let allUnchecked = true;
        let shouldChangeSelectAll = false;
        let checkAllReference: MatCheckbox;
        this.checkboxList.forEach((cb: MatCheckbox) => {
            if (cb.name === 'toggle-select-all') {
                checkAllReference = cb;
            } else {
                shouldChangeSelectAll = true;
                if (cb.checked) {
                    allUnchecked = false;
                    value.push(cb.name);
                } else {
                    allChecked = false;
                }
            }
        });
        if (checkAllReference && shouldChangeSelectAll) {
            if (allChecked) {
                checkAllReference.checked = true;
            } else if (allUnchecked) {
                checkAllReference.checked = false;
            }
        }
        return value;
    }

    /**
     * Quando cambia il valore nel form aggiorna
     * il valore visibile
     * @private
     */
    private subscribeToExternalChange() {
        if (!!this.externalChangeSubscription) {
            return;
        }
        if (!this.formRef || !this.formRef?.controls[this.field.key + this.field.suffix]) {
            setTimeout(this.subscribeToExternalChange, 100);
            return;
        }
        this.externalChangeSubscription = this.formRef.controls[this.field.key + this.field.suffix].valueChanges.subscribe(val => {
            if (Array.isArray(val)) {
                this.checkboxList.forEach(cb => {
                    cb.checked = val.includes(cb.name);
                });
            }
            this.optionSelectedEvent(true);
        });
    }
}
