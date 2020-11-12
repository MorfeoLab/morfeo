import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {IForm, IFormAjaxResponse, IFormElement, IFormTableColumn} from '../../shared/models/form-element.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormContainerConfig, MrfFormComponent} from '../../mrf-form.component';
import {DataTableService} from '../../shared/services/data-table-service/data-table.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'mrf-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit {
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

    public formConfig: FormContainerConfig;
    public filterFormJson: IForm;
    private filterForm: NgForm;

    public isLoading = false;
    public isError = false;
    public hideLoader = false;


    constructor(
        private dataTableService: DataTableService,
        private http: HttpClient
    ) {
        this.formConfig = {
            showReset: true,
            resetIcon: 'clear',
            resetLabel: 'Annulla',
            resetCallback: () => {
                this.filterTable('')
            },
            showSubmit: true,
            submitIcon: 'search',
            submitLabel: 'Cerca',
            submitCallback: (f) => {
                this.filterTable(f.value)
            }
        };
    }

    ngOnInit(): void {
        this.hideLoader = !!this.field.hideLoader ? this.field.hideLoader : false;
        this.filterFormJson = this.field.data.filter;
        this.columns = this.field.data.columns || [];
        this.displayedColumns = this.columns.map(item => item.value);

        if (this.field.dataSrc === 'values') {
            this.dataSource = new MatTableDataSource<any>(this.field.data.values);

            this.dataTableService.getDataEmitter(this.field.key + this.field.suffix).subscribe((data: any[]) => {
                this.dataSource.data = data;
            });

        } else if (this.field.dataSrc === 'url') {
            this.loadDataFromUrl(this.field.data.url);
        }
    }

    ngAfterViewInit() {
        if (!!this.filterFormRef) {
            this.dataTableService.setFormRef(this.field.key + this.field.suffix, this.filterFormRef);
            this.filterFormRef.formReadyEvent.subscribe(f => {
                this.filterForm = f;
            })
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
        this.paginator.pageSizeOptions = this.field.data.pagination.sizeOptions;
        this.paginator.pageSize = this.field.data.pagination.size || this.field.data.pagination.sizeOptions[0] || 10;
        if (this.field.dataSrc === 'values') {
            this.dataSource.paginator = this.paginator;
        } else if (this.field.dataSrc === 'url') {
            this.paginator.page.subscribe(() => {
                this.loadDataFromUrl()
            });
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
                                    return false
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
            })
        }
    }

    public filterTable(row: any) {
        if (this.field.dataSrc === 'values') {
            this.dataSource.filter = JSON.stringify(row);
        } else if (this.field.dataSrc === 'url') {
            // Ogni nuova ricerca riparte dalla prima pagina
            this.paginator.pageIndex = 0;
            this.loadDataFromUrl();
        }
    }

    public buttonAction(action: string[], row: any) {
        this.dataTableService.getCallback([this.field.key, ...action])(row);
    }

    public render(row, col) {
        if (col.hasOwnProperty('renderer')) {
            const renderer = this.dataTableService.getRenderer(col.renderer);
            return renderer(row[col.value]);
        } else if (row.hasOwnProperty(col.value)) {
            return row[col.value];
        } else {
            return '';
        }
    }

    private loadDataFromUrl(url: string = '') {
        this.isLoading = true;
        this.isError = false;
        url = url || this.field.data.url;
        const paginationOptions = {
            $pageNum: this.getPageNum(),
            $pageSize: this.getPageSize(),
            $sortField: this.getSortField(),
            $sortDirection: this.getSortDirection(),
            $filter: this.getRequestFilter()
        };

        url = url.replace(/\$pageNum|\$pageSize|\$sortField|\$sortDirection|\$filter/gi, (matched) => encodeURI(paginationOptions[matched]));

        this.http.get(url, {observe: 'response'}).subscribe(
            (data: any) => {
                const response: IFormAjaxResponse<any> = this.mapResponseToData(data);
                this.dataSource = new MatTableDataSource(response.records);
                this.paginator.length = response.pagination.totalRecords;
                this.paginator.pageSize = this.getPageSize();
            },
            () => {
                this.isError = true;
            },
            () => {
                this.isLoading = false;
            }
        )
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

    private getPageSize(): number {
        if (!!this.paginator) {
            return this.paginator.pageSize;
        }
        return this.field.data.pagination.size || 5;
    }

    private getPageNum(): number {
        if (!!this.paginator) {
            return this.paginator.pageIndex + 1;
        }
        return 1;
    }

    private getSortField(): string {
        const defaultSortColumn: IFormTableColumn = this.field.data.columns.filter(e => !!e.sortDefault);
        const sortName = !!defaultSortColumn[0] ? defaultSortColumn[0].value : this.displayedColumns[0];
        if (!!this.sort) {
            return this.sort.active || sortName;
        }
        return '';
    }

    private getSortDirection(): string {
        const defaultSortDirectionColumn: IFormTableColumn = this.field.data.columns.filter(e => !!e.sortDirectionDefault);
        const sortDirection = !!defaultSortDirectionColumn[0] ? defaultSortDirectionColumn[0].sortDirectionDefault : 'desc';
        if (!!this.sort) {
            return this.sort.direction || sortDirection;
        }
        return '';
    }

    private getRequestFilter(): string {
        let filterString = '';
        if (!!this.filterForm) {
            filterString = this.dataTableService.getRequestFilter(this.filterForm.value);
        }
        return filterString;
    }
}
