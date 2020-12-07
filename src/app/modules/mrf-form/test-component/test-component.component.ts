import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IForm} from '../shared/models/form-element.model';
import {MrfFormComponent} from '../mrf-form.component';
import {DataTableService} from '../shared/services/data-table-service/data-table.service';

@Component({
    selector: 'mrf-test-component',
    templateUrl: './test-component.component.html',
    styleUrls: ['./test-component.component.scss']
})
// Component used to test and develop the library
export class TestComponentComponent implements AfterViewInit {
    title = 'morfeo';

    public mainFormObj: NgForm;
    @ViewChild('mainForm', {static: true}) public mainFormContainer: MrfFormComponent;
    public mainFormJson: IForm;

    constructor(
        private datatableService: DataTableService
    ) {


        this.datatableService.setResponseHandler('tabellaDati', (res) => {
            return {
                pagination: {
                    totalPages: 1,
                    totalRecords: res.body.length
                },
                records: res.body
            }
        });
        this.datatableService.setRenderer('title', val => {
            return val.rendered;
        });
        this.datatableService.setRenderer('date', val => {
            return new Date(val).toLocaleDateString();
        })

        this.mainFormJson = TEST_FORM;
    }

    public clickMe() {
        console.log(TEST_VALUE);
        console.log(this.mainFormContainer.f.value);
        this.mainFormContainer.f.resetForm({...this.mainFormContainer.f.value, ...TEST_VALUE});
    }

    public clickMe2() {
        this.mainFormContainer.f.setValue(TEST_VALUE);
    }

    ngAfterViewInit() {
        // this.mainFormContainer.formReadyEvent.subscribe(f => {
        //     this.mainFormObj = f;
        //     let lastValue = f.controls.oraEmissioneMarca.value;
        //     setInterval(() => {
        //         const currentValue = f.controls.oraEmissioneMarca.value;
        //         if (currentValue !== lastValue) {
        //             console.log(currentValue);
        //             lastValue = currentValue;
        //         }
        //     })
        // })
    }

}

const TEST_FORM: IForm = {
    components: [
        {
            type: 'dataTable',
            key: 'tabellaDati',
            label: '',
            dataSrc: 'url',
            data: {
                url: 'https://www.danielealessandra.com/wp-json/wp/v2/posts?$filter',
                filter: {
                    components: [
                        {
                            type: 'select',
                            label: 'Uno (url)',
                            key: 'uno',
                            dataSrc: 'url',
                            data: {
                                url: 'https://www.danielealessandra.com/wp-json/wp/v2/posts',
                                values: []
                            },
                            valueProperty: 'id',
                            labelProperty: 'slug',
                            defaultValue: 3326
                        },
                        {
                            type: 'select',
                            label: 'Due (values)',
                            key: 'due',
                            dataSrc: 'values',
                            data: {
                                values: [
                                    {
                                        value: 'jay',
                                        label: 'Will Smith'
                                    },
                                    {
                                        value: 'kay',
                                        label: 'Tommy Lee Jones'
                                    }
                                ]
                            },
                            defaultValue: 'kay'
                        }
                    ]
                },
                columns: [
                    {
                        value: 'id',
                        label: 'ID'
                    },
                    {
                        value: 'date',
                        label: 'Date',
                        renderer: 'date',
                        style: {
                            align: 'center'
                        }
                    },
                    {
                        value: 'status',
                        label: 'Status',
                        renderer: 'status'
                    },
                    {
                        value: 'title',
                        label: 'Titolo',
                        renderer: 'title'
                    }
                ],
                pagination: {
                    sizeOptions: [
                        3,
                        5,
                        10,
                        15
                    ]
                }
            }
        }
    ]
}


const TEST_VALUE = {};