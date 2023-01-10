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
import {ObjectListModalComponent} from './object-list-modal/object-list-modal.component';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {IFormElement, IFormTableColumn} from '../../shared/models/form-element.model';
import {ObjRulesModalComponent} from './obj-rules-modal/obj-rules-modal.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'mrf-object-list',
    templateUrl: './object-list.component.html',
    styleUrls: ['./object-list.component.scss']
})
export class ObjectListComponent implements OnInit, AfterViewInit {
    /**
     * JSON di definizione del campo
     */
    @Input() field: IFormElement;

    /**
     * Riferimento al form
     */
    @Input() formRef: NgForm;


    @Input() readOnly: boolean;

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
     * servizio di ricerca per l'autocomplete
     * della creazione delle regole
     */
    public jsonRuleService: any;

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

        /**
         * Se esiste, mi riporto il servizio di ricerca per l'autocomplete
         * della creazione delle regole
         */

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
        const dialogRef = this.dialog.open(ObjectListModalComponent, {
            width: '80%',
            height: '80%',
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
             * Gestisco valori di default
             */
            if (!!this.field.defaultValue) {
                for (const element of data) {
                    if (this.utility.isNullOrUndefined(element.rule)) {
                        element.rule = this.field.defaultValue;
                    }
                }
            }

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
            emitEvent: touch
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
        if (!!this.hiddenControl) {
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

    openDialogRules(element: any) {
        let jsonRuleService = '';
        if (!!this.field.data.jsonRuleService) {
            jsonRuleService = this.field.data.jsonRuleService;
        }
        this.dialog.open(ObjRulesModalComponent, {
            width: '80%',
            height: '80%',
            data: {
                element,
                jsonRuleService,
                parentField: this.field
            }
        });
    }

    getIcon(element) {
        if (!!element.rule) {
            return 'playlist_add_checked';
        }
        return 'playlist_add';
    }
}
