import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IForm} from '../../../shared/models/form-element.model';
import {DataSelectData} from '../data-select-data.model';
import {NgForm} from '@angular/forms';
import {DataTableService} from '../../../shared/services/data-table/data-table.service';
import {UtilityService} from '../../../shared/services/utility/utility.service';
import {ConditionalService} from '../../../shared/services/conditional/conditional.service';
import {MrfFormComponent} from '../../../mrf-form.component';

@Component({
    selector: 'mrf-data-select-modal',
    templateUrl: './data-select-modal.component.html',
    styleUrls: ['./data-select-modal.component.scss']
})
export class DataSelectModalComponent implements OnInit, AfterViewInit {
    public tableForm: IForm;
    public tableExternalData: { [key: string]: any };
    public selectedItems: any[];
    public formRef: NgForm;
    @ViewChild (MrfFormComponent, {static: false}) private formContainer: MrfFormComponent;

    constructor(
        public dialogRef: MatDialogRef<DataSelectModalComponent>,
        private conditionalService: ConditionalService,
        private dataTableService: DataTableService,
        private utils: UtilityService,
        @Inject(MAT_DIALOG_DATA) public data: DataSelectData
    ) {
    }

    ngOnInit() {
        this.formRef = this.data.formRef;
        this.selectedItems = this.data.selected || [];
        this.tableForm = {
            components: [
                this.data.field
            ]
        };
        this.tableExternalData = this.data.externalData;

        this.dataTableService.setButtonVisibilityFunction(
            [this.data.field.key + this.data.field.suffix, 'data-select-button-column', 'doSelect'],
            (row) => !this.isSelected(row)
        );

        this.dataTableService.setButtonVisibilityFunction(
            [this.data.field.key + this.data.field.suffix, 'data-select-button-column', 'doUnselect'],
            (row) => this.isSelected(row)
        );

        this.dataTableService.setCallback(
            [this.data.field.key + this.data.field.suffix, 'data-select-button-column', 'doSelect'],
            (row) => {
                this.selectedItems.push(row);
            }
        );

        this.dataTableService.setCallback(
            [this.data.field.key + this.data.field.suffix, 'data-select-button-column', 'doUnselect'],
            (row) => {
                if (this.data.field.hasOwnProperty('idProperty') && row.hasOwnProperty(this.data.field.idProperty)) {
                    this.selectedItems = this.selectedItems.filter(item => !item[this.data.field.idProperty]);
                } else {
                    this.selectedItems = this.selectedItems.filter(item => !this.utils.areObjectsEquivalent(row, item));
                }
            }
        );
    }

    ngAfterViewInit() {
        if (!!this.formContainer) {
            this.formContainer.formReadyEvent.subscribe(() => {
                this.conditionalService.applyAllJsonRules();
                // this.utils.beep();
            });
        }
    }

    private isSelected(row: any) {
        if (this.data.field.hasOwnProperty('idProperty') && row.hasOwnProperty(this.data.field.idProperty)) {
            return this.selectedItems.filter(item => !!item[this.data.field.idProperty]).length > 0;
        } else {
            for (const item of this.selectedItems) {
                if (this.utils.areObjectsEquivalent(row, item)) {
                    return true;
                }
            }
        }
        return false;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
