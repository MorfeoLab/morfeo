import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {
    IForm,
    IFormAjaxResponse,
    IFormElement,
    IFormTableColumn,
    IFormTooltip
} from '../../shared/models/form-element.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormContainerConfig, MrfFormComponent} from '../../mrf-form.component';
import {DataTableService} from '../../shared/services/data-table/data-table.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {ConditionalService} from '../../shared/services/conditional/conditional.service';
import {UtilityService} from '../../shared/services/utility/utility.service';

@Component({
    selector: 'mrf-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit {


    constructor(
        private dataTableService: DataTableService,
        private http: HttpClient,
        private conditionalService: ConditionalService,
        private utility: UtilityService
    ) {
        this.formConfig = {
            showReset: true,
            resetIcon: 'clear',
            resetLabel: 'Annulla',
            resetCallback: () => {
                this.filterTable('');
            },
            showSubmit: true,
            submitIcon: 'search',
            submitLabel: 'Cerca',
            submitCallback: (f) => {
                this.filterTable(f.value);
            }
        };
    }

    public dataSource: MatTableDataSource<any>;
    /**
     * Elenco delle colonne da visualizzare in tabella
     */
    displayedColumns: string[];
    columns: IFormTableColumn[] = [];

    @ViewChild(MrfFormComponent) filterFormRef: MrfFormComponent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    @Input() field: IFormElement;
    @Input() formRef: NgForm;
    @Input() externalData: { [key: string]: any };

    private renderedValues: { [key: string]: string } = {};

    public formConfig: FormContainerConfig;
    public filterFormJson: IForm;
    private filterForm: NgForm;

    public isLoading = false;
    public isError = false;
    public hideLoader = false;

    public paginatorPageSize = 0;
    public paginatorPageIndex = 0;
    public paginatorPageSizeOptions: number[] = [5, 10, 15];
    public paginatorLength = 0;

    private static getCellKey(row, col) {
        return btoa(JSON.stringify(row) + '-' + JSON.stringify(col));
    }

    ngOnInit(): void {
        this.hideLoader = !!this.field.hideLoader ? this.field.hideLoader : false;
        this.filterFormJson = this.field.data.filter;
        this.columns = this.field.data.columns || [];
        this.initColumnVisibility();
        this.initUrlLogic();
        this.dataTableService.registerComponent(this.field.key + this.field.suffix, this);

        if (this.field.dataSrc === 'values') {
            this.dataSource = new MatTableDataSource<any>(this.field.data.values);

            /**
             * Per permettere l'ordinamento di valori con funzioni personalizzate
             */
            this.dataSource.sortingDataAccessor = (item, property) => {
                const sortingFunction = this.dataTableService.getSortingFunction([this.field.key, property]);
                if (!!sortingFunction) {
                    return sortingFunction(item, property);
                }
                return item[property];
            };

            this.dataTableService.getDataEmitter(this.field.key + this.field.suffix).subscribe((data: any) => {
                if (data.hasOwnProperty('records')) {
                    this.dataSource = data.records;
                    if (!!data.pagination) {
                        this.paginatorPageIndex = Math.max((data.pagination.currentPage - 1), 0);
                        this.paginatorPageSize = data.pagination.pageSize || this.paginatorPageSize;
                        this.paginatorLength = data.pagination.totalRecords || this.paginatorLength;
                    }
                } else {
                    this.dataSource.data = data;
                }
            });

        } else if (this.field.dataSrc === 'url') {
            if (!this.filterFormJson) {
                /// Non ho filtri, carico subito i dati
                this.loadDataFromUrl(this.field.data.url);
            }
        }
    }

    ngAfterViewInit() {
        if (!!this.filterFormRef) {
            this.dataTableService.setFormRef(this.field.key + this.field.suffix, this.filterFormRef);
            this.filterFormRef.formReadyEvent.subscribe(f => {
                console.log('Il form di filtro della tabella è pronto adesso');
                this.filterForm = f;
                if (this.field.dataSrc === 'url') {
                    /// Se ho il filtro non ho ancora caricato
                    setTimeout(() => {
                        this.loadDataFromUrl(this.field.data.url);
                    }, 60); /// Dentro ComboElementComponent.setComboElements c'è un ritardo di 50ms, questo deve essere superiore
                }
            });
        }
        if (!!this.field.data.pagination) {
            this.initPagination();
        }
        if (this.columns.filter(item => item.sortable).length > 0) {
            this.initSorting();
        }
        this.initFiltering();
    }

    private initPagination() {
        this.paginatorPageSizeOptions = this.field.data.pagination.sizeOptions;
        this.paginatorPageSize = this.field.data.pagination.size || this.field.data.pagination.sizeOptions[0] || 10;
        if (this.field.dataSrc === 'values') {
            this.dataSource.paginator = this.paginator;
        } else if (this.field.dataSrc === 'url') {
            this.paginator.page.subscribe((event) => {
                this.paginatorPageSize = event.pageSize;
                this.paginatorPageIndex = event.pageIndex;
                this.paginatorLength = event.length;
                /// {previousPageIndex: 0, pageIndex: 1, pageSize: 3, length: 10}
                this.loadDataFromUrl();
            });
        }
    }

    public paginatorEvent(event) {
        const paginatorCallback = this.dataTableService.getPaginatorCallback(this.field.key + this.field.suffix);
        if (!!paginatorCallback) {
            paginatorCallback(event);
        }
    }

    private initFiltering() {
        if (this.field.dataSrc === 'values') {
            this.dataSource.filterPredicate = (row: any, filter: string) => {
                const filterObj = JSON.parse(filter);
                for (const key in filterObj) {
                    if (filterObj.hasOwnProperty(key)) {
                        if (filterObj[key] !== null) {
                            if (row.hasOwnProperty(key)) {
                                if (row[key].toLowerCase().indexOf(filterObj[key].toLowerCase()) === -1) {
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
            };
        }
    }

    private initSorting() {
        if (this.field.dataSrc === 'values') {
            this.dataSource.sort = this.sort;
        } else if (this.field.dataSrc === 'url') {
            this.sort.sortChange.subscribe(() => {
                this.loadDataFromUrl();
            });
        }
    }

    public filterTable(row?: any) {
        if (this.field.dataSrc === 'values') {
            this.dataSource.filter = JSON.stringify(row || {});
        } else if (this.field.dataSrc === 'url') {
            // Ogni nuova ricerca riparte dalla prima pagina
            this.paginatorPageIndex = 0;
            this.loadDataFromUrl();
        }
    }

    public buttonAction(action: string[], row: any) {
        this.dataTableService.getCallback([this.field.key, ...action])(row);
    }

    public getCellTooltip(row, col): IFormTooltip {
        if (col.hasOwnProperty('cellTooltip')) {
            const tooltip = this.dataTableService.getTooltipFactory(col.cellTooltip);
            return tooltip(row);
        }
        return {
            text: ''
        };
    }

    public getRenderedValue(row, col) {
        const cellKey = DataTableComponent.getCellKey(row, col);

        if (this.renderedValues.hasOwnProperty(cellKey)) {
            return this.renderedValues[cellKey];
        }
        this.render(row, col);
        return '?';
    }

    private render(row, col) {
        const cellKey = DataTableComponent.getCellKey(row, col);
        let colValue = '';
        if (row.hasOwnProperty(col.value)) {
            colValue = row[col.value];
        }
        if (col.hasOwnProperty('renderer')) {
            const renderer = this.dataTableService.getRenderer(col.renderer);
            const renderedValue = renderer(colValue, row);
            if (typeof renderedValue === 'string') {
                this.renderedValues[cellKey] = renderedValue;
            } else {
                (renderedValue as Promise<string>).then(result => {
                    console.log(result);
                    this.renderedValues[cellKey] = result;
                });
            }
        } else {
            this.renderedValues[cellKey] = colValue;
        }
    }

    private loadDataFromUrl(url: string = '') {
        this.isLoading = true;
        this.isError = false;
        url = url || this.field.data.url;
        if (this.utility.isJSON(url)) {
            console.warn('La tabella è configurata per calcolare la URL in runtime, ma non è ancora pronta');
            return;
        }
        const paginationOptions = {
            $pagenum: this.getPageNum(),
            $pagesize: this.getPageSize(),
            $sortfield: this.getSortField(),
            $sortdirection: this.getSortDirection(),
            $filter: this.getRequestFilter()
        };

        url = url.replace(/\$pageNum|\$pageSize|\$sortField|\$sortDirection|\$filter/gi, (matched) => encodeURI(String(paginationOptions[matched.toLowerCase()])));

        this.http.get(url, {observe: 'response'}).subscribe(
            (data: any) => {
                const response: IFormAjaxResponse<any> = this.mapResponseToData(data);
                this.dataSource = new MatTableDataSource(response.records);
                this.paginatorLength = response.pagination?.totalRecords || this.paginatorLength;
                this.paginatorPageIndex = Math.max((response.pagination?.currentPage - 1), 0) || this.paginatorPageIndex;
                this.paginatorPageSize = this.getPageSize(response.pagination?.pageSize);
            },
            () => {
                this.isError = true;
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    public isButtonVisible(action: string[], row: any, button: any) {
        const buttonVisibilityFunction: (button: any, row: any) => boolean = this.dataTableService.getButtonVisibilityFunction([this.field.key, ...action]);
        if (!!buttonVisibilityFunction) {
            return buttonVisibilityFunction(row, button);
        }
        return true;
    }

    private mapResponseToData(data: HttpResponse<any>): IFormAjaxResponse<any> {
        const responseHandler = this.dataTableService.getResponseHandler(this.field.key);
        return responseHandler(data);
    }

    private getPageSize(overridePageSize: number = 0): number {
        if (!!overridePageSize) {
            return overridePageSize;
        }
        return this.paginatorPageSize || this.field.data.pagination.size || 5;
    }

    private getPageNum(): number {
        this.field.data.pagination.startIndex = isNaN(this.field.data.pagination.startIndex) ? 1 : Number(this.field.data.pagination.startIndex);
        if (!!this.paginator) {
            return this.paginatorPageIndex + this.field.data.pagination.startIndex;
        }
        return this.field.data.pagination.startIndex;
    }

    private getSortField(): string {
        const defaultSortColumn: IFormTableColumn[] = this.field.data.columns.filter(e => !!e.sortDefault);
        const sortName = !!defaultSortColumn[0] ? defaultSortColumn[0].value : this.displayedColumns[0];
        if (!!this.sort) {
            return this.sort.active || sortName;
        }
        return '';
    }

    private getSortDirection(): string {
        const defaultSortDirectionColumn: IFormTableColumn[] = this.field.data.columns.filter(e => !!e.sortDirectionDefault);
        const sortDirection = !!defaultSortDirectionColumn[0] ? defaultSortDirectionColumn[0].sortDirectionDefault : 'desc';
        if (!!this.sort) {
            return this.sort.direction || sortDirection;
        }
        return '';
    }

    private getRequestFilter(): string {
        let filterString = '';
        if (!!this.filterForm) {
            /// Recupero un mapper se esiste
            const filterMapper = this.dataTableService.getFilterMapper(this.field.key + this.field.suffix);
            filterString = this.dataTableService.getRequestFilter(this.filterForm.value, filterMapper);
        }
        return filterString;
    }

    private initColumnVisibility() {
        let containsJsonLogic = false;
        this.columns.map(column => {
            if (this.utility.isJSON(column.hidden)) {
                containsJsonLogic = true;
                this.conditionalService.registerJsonRule(
                    this.formRef,
                    column,
                    column.hidden as string,
                    this.externalData,
                    (v) => {
                        let isHidden = true;
                        for (const valid of v) {
                            if (!valid) {
                                isHidden = false;
                            }
                        }
                        column.hidden = isHidden;
                        this.filterColumnVisibility();
                    }
                );
            }
        });
        if (containsJsonLogic) {
            /// @TODO: Non c'è un modo migliore per calcolare il valore iniziale?
            this.conditionalService.applyAllJsonRules();
        }
        this.filterColumnVisibility();
    }

    private filterColumnVisibility() {
        this.displayedColumns = this.columns
            .filter(column => !column.hidden)
            .map(column => column.value);
    }

    private initUrlLogic() {
        /**
         * JsonLogic per l'attributo url
         */
        if (!!this.field.data && this.utility.isJSON(this.field.data.url)) {
            this.conditionalService.registerJsonRule(
                this.formRef,
                this.field,
                (this.field.data.url as string),
                this.externalData,
                (v) => {
                    if (Array.isArray(v)) {
                        v = v.join('');
                    }
                    this.field.data.url = v;
                    this.paginatorPageIndex = 0;
                    this.loadDataFromUrl();
                },
                true
            );
        }
    }
}
