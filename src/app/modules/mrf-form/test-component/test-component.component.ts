import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IForm} from '../shared/models/form-element.model';
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
export class TestComponentComponent implements OnInit, AfterViewInit {
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

    ngOnInit() {
        const dateSortingFunction = (item, property) => {
            const dateString = item[property];
            const dateParts = dateString.split('-');
            return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        }
        this.mainFormJson = {
            components: [
                {
                    key: 'uno',
                    label: 'Data',
                    type: 'datetime',
                    validate: {
                        custom: '[{"<":["1621502944272",{"var":"uno"}]}]'
                    }
                }
            ]
        }


        // this.dataTableService
        //     .setSortingFunction(['risultatiRicercaSingola', 'dataRichiesta'], dateSortingFunction);
        // this.dataTableService
        //     .setSortingFunction(['risultatiRicercaSingola', 'dataChiusura'], dateSortingFunction);
        // this.dataTableService
        //     .setSortingFunction(['risultatiRicercaSingola', 'dataInizio'], dateSortingFunction);
        // this.dataTableService
        //     .setSortingFunction(['risultatiRicercaSingola', 'dataFine'], dateSortingFunction);


        // this.http.get('assets/forms/rvpa-form-ricerca-richieste-atti.json').subscribe((loadedForm: IForm) => {
        //     this.mainFormJson = loadedForm;
        //     this.http.get('assets/data/rvpa-risultati-ricerca-richieste-atti.json').subscribe((loadedData: any[]) => {
        //         this.dataTableService.setData('risultatiRicercaSingola', loadedData);
        //     })
        // });

        // this.http.get('assets/forms/rvpa-form-crud-richiesta-atti.json').subscribe((loadedForm: IForm) => {
        //     this.mainFormJson = loadedForm;
        // });
    }

    public clickMe() {
        this.uploaderService.uploadAll();
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
            //     let lastValue = f.controls.oraEmissioneMarca.value;
            //     setInterval(() => {
            //         const currentValue = f.controls.oraEmissioneMarca.value;
            //         if (currentValue !== lastValue) {
            //             console.log(currentValue);
            //             lastValue = currentValue;
            //         }
            //     })
        });
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
