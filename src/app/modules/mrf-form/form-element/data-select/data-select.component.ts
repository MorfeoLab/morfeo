import {AfterContentChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {IFormElement} from '../../shared/models/form-element.model';
import {FormControl, NgForm} from '@angular/forms';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {MatDialog} from '@angular/material/dialog';
import {DataSelectModalComponent} from './data-select-modal/data-select-modal.component';
import {DataTableService} from '../../shared/services/data-table/data-table.service';
import {ValueService} from '../../shared/services/value/value.service';

@Component({
    selector: 'mrf-data-select',
    templateUrl: './data-select.component.html',
    styleUrls: ['./data-select.component.scss']
})
export class DataSelectComponent implements OnInit, AfterViewInit, AfterContentChecked {

    @Input() field: IFormElement;
    @Input() externalData: { [key: string]: any };
    @Input() formRef: NgForm;
    @Input() readOnly: boolean;

    /**
     * Hidden field for real value
     */
    public hiddenControl: FormControl;

    /**
     * Conserviamo il precedente valore booleano di visibilità
     * per conoscere il momento in cui cambia
     */
    private componentWasVisible: boolean;

    public tableField: IFormElement;
    public tableExternalData: { [key: string]: any };
    public dialogTableField: IFormElement;
    public dialogTableExternalData: { [key: string]: any };
    public selectedData: any[];


    constructor(
        public dialog: MatDialog,
        private utils: UtilityService,
        private dataTableService: DataTableService,
        private valueService: ValueService
    ) {
    }

    ngOnInit(): void {

        this.dataTableService.setCallback(
            [`selected-${this.field.key}${this.field.suffix}`, 'data-select-button-column', 'doUnselect'],
            (row) => {
                if (this.field.hasOwnProperty('idProperty') && row.hasOwnProperty(this.field.idProperty)) {
                    this.selectedData = this.selectedData.filter(item => !item[this.field.idProperty]);
                } else {
                    this.selectedData = this.selectedData.filter(item => !this.utils.areObjectsEquivalent(row, item));
                }
                this.setData(this.selectedData);
            }
        );
    }

    ngAfterViewInit() {
        /**
         * Recupero un riferimento all'AbstractControl dell'input hidden
         */
        this.hiddenControl = this.formRef.controls[
        this.field.key + this.field.suffix
            ] as FormControl;
        /**
         * Imposto il valore iniziale a null (altrimenti sarebbe stringa vuota)
         */
        setTimeout(() => {
            if (!!this.hiddenControl) {
                this.hiddenControl.setValue(null);
            }
        }, 0);
        /**
         * Registra un listener per il campo hidden
         */
        this.registerHiddenFieldListener();
    }


    /**
     * Se l'elemento è nascosto deve perdere il valore
     */
    ngAfterContentChecked() {
        /// Se il componente è appena comparso ricarica il valore dal form
        const componentIsVisible = this.valueService.isVisible(this.field);
        if (componentIsVisible && !this.componentWasVisible && !!this.hiddenControl) {
            this.setVisibleValue(this.hiddenControl.value);
        }
        this.componentWasVisible = !!componentIsVisible;
        /// Se il componente è appena scomparso controllo se nel form ce ne sono altri con lo stesso nome
        const componentCount = this.valueService.visibleCount;
        if (!componentCount[this.field.key + this.field.suffix]) {
            /// Non ci sono altri controlli con lo stesso nome
            if (!!this.hiddenControl) {
                this.hiddenControl.reset(null, {onlySelf: true, emitEvent: false});
            }
            this.selectedData = [];
        }
    }

    registerHiddenFieldListener() {
        if (!!this.hiddenControl) {
            this.hiddenControl.valueChanges.subscribe((v: any[] = []) => {
                this.setVisibleValue(v);
            });
        }
    }

    public setVisibleValue(v: any[] = []) {
        if (!Array.isArray(v)) {
            /**
             * Possiamo accettare solo Array come valore,
             * nel caso in cui arrivi qualcosa di diverso
             * verrà utilizzato un array vuoto.
             */
            this.selectedData = [];
        }
        this.selectedData = v;
        this.setData(this.selectedData);
    }

    getTableField() {
        if (!!this.field) {
            this.tableField = {
                type: 'dataTable',
                key: `selected-${this.field.key}`,
                suffix: this.field.suffix,
                label: this.field.label,
                dataSrc: 'values', // this.field.dataSrc,
                data: Object.assign({}, this.field.data)
            };
            this.tableField.data.url = '';
        }
        this.tableField.data.columns = [
            {
                label: '',
                value: 'data-select-button-column',
                buttons: [
                    {
                        label: 'Unselect',
                        icon: 'check_box',
                        action: 'doUnselect',
                        color: 'primary',
                        style: 'icon',
                        tooltip: {
                            text: 'Unselect'
                        }
                    }
                ]
            },
            ...this.tableField.data.columns
        ];
        this.tableExternalData = {
            ...this.externalData,
            ...this.formRef.value
        };
        // this.utils.beep();
        return this.tableField;
    }

    public openModal() {

        this.dialogTableField = {
            type: 'dataTable',
            key: this.field.key,
            suffix: this.field.suffix,
            label: this.field.label,
            dataSrc: this.field.dataSrc,
            data: Object.assign({}, this.field.data)
        };
        this.dialogTableField.data.url = this.field.data.url;
        this.dialogTableField.data.columns = [
            {
                label: '',
                value: 'data-select-button-column',
                buttons: [
                    {
                        label: 'Select',
                        icon: 'check_box_outline_blank',
                        action: 'doSelect',
                        color: 'primary',
                        style: 'icon',
                        tooltip: {
                            text: 'Select'
                        }
                    },
                    {
                        label: 'Unselect',
                        icon: 'check_box',
                        action: 'doUnselect',
                        color: 'primary',
                        style: 'icon',
                        tooltip: {
                            text: 'Unselect'
                        }
                    }
                ]
            },
            ...this.dialogTableField.data.columns
        ];
        this.dialogTableExternalData = {
            ...this.externalData,
            ...this.formRef.value
        };


        const dialogRef = this.dialog.open(DataSelectModalComponent, {
            data: {
                field: this.dialogTableField,
                externalData: this.dialogTableExternalData,
                selected: this.selectedData,
                formRef: this.formRef
            }
        });


        dialogRef.afterClosed().subscribe((result: any[]) => {
            if (!result) {
                return;
            }
            if (this.hiddenControl) {
                this.hiddenControl.setValue(result);
            }
        });
    }

    private setData(data: any[]) {
        this.selectedData = data || [];
        this.dataTableService.setData(`selected-${this.field.key}`, this.selectedData);
    }

}
