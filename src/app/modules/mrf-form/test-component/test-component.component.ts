import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IForm, IFormAjaxResponse, IFormOptions} from '../shared/models/form-element.model';
import {TabsService} from '../shared/services/tabs/tabs.service';
import {FormContainerConfig, MrfFormComponent} from '../mrf-form.component';
import {DataService} from '../shared/services/data-service/data-service.service';
import {DataTableService} from '../shared/services/data-table-service/data-table.service';
import {DatepickerService} from '../shared/services/datepicker-service/datepicker.service';
import {UploaderService} from '../shared/services/uploader.service';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Component({
    selector: 'mrf-test-component',
    templateUrl: './test-component.component.html',
    styleUrls: ['./test-component.component.scss']
})
// Component used to test and develop the library
export class TestComponentComponent implements OnInit, AfterViewInit {
    title = 'morfeo';

    public searchFormConfig: FormContainerConfig;
    public form: IForm;
    public searchForm2: IForm;
    public formRef: NgForm;
    @ViewChild('form1', {static: true}) public formContainer: MrfFormComponent;
    @ViewChild('form1', {static: true}) public asd: ElementRef;
    @ViewChild('form2') public formContainer2: MrfFormComponent;

    public elementAvailable: IFormOptions[] = [];

    constructor(
        private tabsService: TabsService,
        private data: DataService,
        private changeDetectorRef: ChangeDetectorRef,
        private httpClient: HttpClient,
        public dataTableService: DataTableService,
        public datepickerService: DatepickerService,
        public uploadService: UploaderService
    ) {
        this.dataTableService.setResponseHandler('table4', res => {
            return {
                pagination: {
                    totalPages: 1,
                    totalRecords: res.body.length
                },
                records: res.body
            }
        });

        this.setFormJson();
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.formContainer.formReadyEvent.subscribe(f => {
            this.formRef = f;
        })
        this.changeDetectorRef.detectChanges();
    }

    applyFilter() {
    }

    setFormJson() {
        const filterForm: IForm = {
            components: [
                {
                    key: 'autocomplete',
                    type: 'autocomplete',
                    label: 'Completamento automatico',
                    placeholder: 'Inserisci almeno due caratteri',
                    labelProperty: 'city',
                    valueProperty: 'name',
                    dataSrc: 'url',
                    data: {
                        url: 'https://pastebin.com/raw/RiYKY6q7?code=',
                        autocompleteType: 'server',
                        values: []
                    },
                }
            ]
        };

        this.form = {
            components: [
                {
                    type: 'textfield',
                    label: 'Questo campo è nascosto',
                    key: 'hidden1',
                    hidden: true
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [
                                {
                                    type: 'textfield',
                                    label: 'Questo campo è nascosto, e anche se si trova dentro una colonna non occupa spazio',
                                    key: 'hidden2',
                                    hidden: true
                                },
                                {
                                    type: 'textfield',
                                    label: 'Questo campo è visibile e dentro una colonna',
                                    key: 'visible1'
                                }
                            ]
                        },
                        {
                            components: [
                                {
                                    type: 'textfield',
                                    label: 'Anche questo campo è visibile',
                                    key: 'visible2'
                                }
                            ]
                        }
                    ]
                }
            ]
        }


        // this.searchForm2 = {};

    }

    public handleResponse(res: HttpResponse<any>): IFormAjaxResponse<any> {
        return {
            pagination: {
                totalPages: +res.headers.get('x-wp-totalpages'),
                totalRecords: +res.headers.get('x-wp-total')
            },
            // records: res.body
            records: []
        }
    }

    public getSubProperty(val: any) {
        if (val.hasOwnProperty('rendered')) {
            return val.rendered;
        }
        return val;
    }

    public dateRenderer(val: any) {
        const date = new Date(val);
        return date.toDateString();
    }

    public qualcosa(row) {
        console.log('qualcosa');
        console.log(row);
        alert('qualcosa');
    }

    public qualcosAltro(row) {
        console.log('qualcosAltro');
        console.log(row);
        alert('qualcosAltro');
    }

    nextTab() {
        this.tabsService.$eventHandler.next({
            callback: 'nextTab'
        });
    }

    tellMeTabs() {
        // this.elementAvailable = this.formRef.value.quadri.map(e => ({value: e.codice , label: e.id}));
        this.formContainer.setListaAutocompleteObjList(this.elementAvailable);
    }

    setFocus() {
    }

    callMeBaby() {
        this.formRef.setValue({hiddenfield: 'valore'});

        console.log(this.formRef.value);

        // this.uploadService.setDownload('esitoPdf', 'http://www.google.com');
    }

    post1() {
        this.httpClient.post('https://reqres.in/api/users', {
            name: 'morpheus',
            job: 'leader'
        }).subscribe((value => {
            console.log(value)
        }))
    }

    post2() {
        this.httpClient.post('https://reqres.in/api/users', {
            name: 'tamatrz',
            job: 'tm3'
        }).subscribe((value => {
            console.log(value)
        }))
    }
}
