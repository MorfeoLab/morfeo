import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IForm, IFormElement} from '../shared/models/form-element.model';
import {MrfFormComponent} from '../mrf-form.component';
import {HttpClient} from '@angular/common/http';
import {DataTableService} from '../shared/services/data-table-service/data-table.service';
import {UploaderService} from '../shared/services/uploader.service';

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
        private http: HttpClient,
        private dataTableService: DataTableService,
        private uploaderService: UploaderService
    ) {
        // this.mainFormJson = TEST_FORM;
    }

    public clickMe() {
        console.log(this.uploaderService.uploadElements);
        // console.log(TEST_VALUE);
        // console.log(this.mainFormContainer.f.value);
        // this.mainFormContainer.f.resetForm({...this.mainFormContainer.f.value, ...TEST_VALUE});
    }

    public clickMe2() {
        this.mainFormContainer.f.setValue(TEST_VALUE_2);
    }

    ngAfterViewInit() {
        this.mainFormContainer.formReadyEvent.subscribe(f => {
            this.mainFormObj = f;
            //     let lastValue = f.controls.oraEmissioneMarca.value;
            //     setInterval(() => {
            //         const currentValue = f.controls.oraEmissioneMarca.value;
            //         if (currentValue !== lastValue) {
            //             console.log(currentValue);
            //             lastValue = currentValue;
            //         }
            //     })
        });

        const listAllegatoTipoRichiestaModel = [
            {
                id: 5,
                tipoDocumento: 'P',
                descrizione: 'Descrizione allegato',
                idTipoRichiesta: '12'
            }
        ];
        this.http.get('assets/forms/rvpa-form-crud-richiesta-atti.json').subscribe(
            (f: IForm) => {

                f.components.forEach(el => {
                    if (el.key === 'uploadFile') {
                        //////////////////////////////////////////////////////////////////////
                        listAllegatoTipoRichiestaModel
                            .filter(la => ['P','R'].includes(la.tipoDocumento))
                            .forEach(la=>{

                                const allegato: IFormElement = {
                                    label: la.descrizione,
                                    key: 'allegato_' + la.id,
                                    type: 'file',
                                    target: '',
                                    hidden: false,
                                    singleUpload: true,
                                    validate: {
                                        required: false,
                                        pattern: '.*',
                                        custom: ''
                                    },
                                    suffix: '',
                                    defaultValue: null,
                                    input: true,
                                    data: {},
                                    disabled: false
                                };
                                const table: IFormElement = {
                                    type: 'dataTable',
                                    key: 'table_allegato_' + la.id,
                                    dataSrc: 'values',
                                    hidden: false,
                                    data: {
                                        values: [{nomeFile: ''}],
                                        columns: [
                                            {
                                                value: 'nomeFile',
                                                sortable: false
                                            },
                                            {
                                                value: 'tools',
                                                buttons: [
                                                    {
                                                        label: 'Download',
                                                        icon: 'cloud_download',
                                                        action: 'download',
                                                        color: 'primary',
                                                        style: 'icon'
                                                    },
                                                    {
                                                        label: 'Allegato',
                                                        icon: 'attachment',
                                                        color: 'primary',
                                                        style: 'icon'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                };

                                el.columns[la.tipoDocumento === 'R' ? 0: 1].components.push(allegato);
                                el.columns[la.tipoDocumento === 'R' ? 0: 1].components.push(table);

                                this.dataTableService.setButtonVisibilityFunction(['table_allegato_' + la.id, 'tools', 'attachment'], (row) => {
                                    return row.nomeFile === '';
                                });
                                this.dataTableService.setButtonVisibilityFunction(['table_allegato_' + la.id, 'tools', 'download'], (row) => {
                                    return row.nomeFile !== '';
                                });
                                // this.dataTableService.setCallback(['table_allegato_' + la.id, 'tools', 'download'],(row) => {
                                //     this.allegatoRichiestaServices.downloadAllegato(row.id, row.idDocumentale );
                                // });
                            });
                        //////////////////////////////////////////////////////////////////////





                    }
                });

                this.mainFormJson = f;
            },
            (err) => {
                alert(err);
            }
        )
    }

}


const TEST_VALUE = {
    datetime: '1980-11-30T23:00:00.000Z',
    uno: 3326,
    due: 'jay'
};

const TEST_VALUE_2 = {
    datetime: '1970-01-01T23:00:00.000Z',
    uno: 3326,
    due: 'kay'
};
