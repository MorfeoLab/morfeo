import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ObjectListSelectorModalComponent} from './object-list-selector-modal/object-list-selector-modal.component';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {IFormElement, IFormTableColumn} from '../../shared/models/form-element.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'mrf-object-list-selector',
    templateUrl: './object-list-selector.component.html',
    styleUrls: ['./object-list-selector.component.scss']
})
export class ObjectListSelectorComponent implements OnInit, AfterViewInit {
    /**
     * JSON di definizione del campo
     */
    @Input() field: IFormElement;


    @Input() readOnly: boolean;

    /**
     * Riferimento al form
     */
    @Input() formRef: NgForm;

    /**
     * EventEmitter per i controlli globali
     */
    @Output() change = new EventEmitter();
    @Output() changeGlobal = new EventEmitter();

    /**
     * Elenco delle colonne da visualizzare in tabella
     */
    displayedColumns: string[] = [];

    /**
     * Dati
     */
    tableDataSource = new MatTableDataSource<any>([]);

    /**
     * Definizione colonne
     */
    columnsDefinition: IFormTableColumn[] = [];

    /**
     * La selezione
     */
    selection = new SelectionModel<any>(true, []);

    /**
     * Riferimento alla tabella
     */
    @ViewChild('table') table: MatTable<any>;

    /**
     * Hidden field for real value
     */
    hiddenControl: FormControl;

    /**
     * L'etichetta da rappresentare
     */
    public displayLabel: string;

    constructor(
        public dialog: MatDialog,
        private changeDetector: ChangeDetectorRef,
        private utility: UtilityService,
        private translatable: TranslatablePipe
    ) {
    }

    ngOnInit() {
        this.field.suffix = this.field.suffix || '';

        /**
         * Le definizioni delle colonne si trovano nel field
         */
        this.columnsDefinition = this.field.columnsDefinition || [];

        /**
         * Le colonne da visualizzare dipendono dalla definizione
         */
        this.displayedColumns = ['reorder'];
        for (const col of this.columnsDefinition) {
            this.displayedColumns.push(col.value);
        }
        this.displayedColumns.push('tools');

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
         * Recupero un riferimento all'AbstractControl dell'input hidden
         */
        this.hiddenControl = this.formRef.controls[
        this.field.key + this.field.suffix
            ] as FormControl;

        /**
         * Registra un listener per il campo hidden
         */
        this.registerHiddenFieldListener();

        this.checkSelected();
    }

    checkSelected() {
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ObjectListSelectorModalComponent, {
            data: {
                field: this.field,
                selected: this.tableDataSource.data
            }
        });

        dialogRef.afterClosed().subscribe((result: SelectionModel<any>) => {
            if (!result) {
                return;
            }
            const data = [];
            data.push(...result.selected);
            /**
             * Elimino eventuali doppioni
             */
            // if (data.length > 0) {
            //   for (const itemToAdd of result.selected) {
            //     if (this.utilityService.getObjEquivalentIndex(data, itemToAdd) < 0) {
            //     }
            //   }
            // } else {
            // }

            this.tableDataSource.data = data;
            this.refreshFieldValue();
        });
    }

    onListDrop(event: CdkDragDrop<string[]>) {
        const data = JSON.parse(JSON.stringify(this.tableDataSource.data || []));
        moveItemInArray(data, event.previousIndex, event.currentIndex);
        this.tableDataSource.data = JSON.parse(JSON.stringify(data));
        this.refreshFieldValue();
    }

    removeElement(element) {
        let index = -1;
        for (let i = 0; i < this.tableDataSource.data.length; i++) {
            if (
                this.utility.areEquivalent(
                    this.tableDataSource.data[i],
                    element,
                    this.field.idProperty
                )
            ) {
                index = i;
            }
        }
        if (index < 0 || index > this.tableDataSource.data.length - 1) {
            return;
        }
        const data = JSON.parse(JSON.stringify(this.tableDataSource.data));
        data.splice(index, 1);
        this.tableDataSource.data = JSON.parse(JSON.stringify(data));
        this.refreshFieldValue();
    }

    refreshFieldValue(touch: boolean = true) {
        this.hiddenControl.setValue(this.tableDataSource.data, {
            emitEvent: false
        });
        if (touch) {
            this.hiddenControl.markAsTouched();
            this.hiddenControl.markAsDirty();
        }

        this.change.emit(this.tableDataSource.data);
        this.changeGlobal.emit(this.tableDataSource.data);
        this.changeDetector.detectChanges();
    }

    registerHiddenFieldListener() {
        if (this.hiddenControl) {
            this.hiddenControl.valueChanges.subscribe((v: any) => {
                try {
                    this.tableDataSource.data = v;
                } catch (e) {
                    this.tableDataSource.data = [];
                }
                this.refreshFieldValue(false);
            });
        }
    }
}
