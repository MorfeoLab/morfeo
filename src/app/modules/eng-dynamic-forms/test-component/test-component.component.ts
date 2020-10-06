import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IForm, IFormAjaxResponse, IFormOptions} from '../shared/models/form-element.model';
import {TabsService} from '../shared/services/tabs/tabs.service';
import {EngDynamicFormsComponent, FormContainerConfig} from '../eng-dynamic-forms.component';
import {DataService} from '../shared/services/data-service/data-service.service';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {DataTableService} from '../shared/services/data-table-service/data-table.service';
import {DatepickerService} from '../shared/services/datepicker-service/datepicker.service';
import {UploaderService} from '../shared/services/uploader.service';


@Component({
  selector: 'mrf-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
// Component used to test and develop the library
export class TestComponentComponent implements OnInit, AfterViewInit {
  title = 'morfeo';

  public searchFormConfig: FormContainerConfig;
  public searchForm: IForm;
  public searchForm2: IForm;
  public formRef: NgForm;
  @ViewChild('form1', {static: true}) public formContainer: EngDynamicFormsComponent;
  @ViewChild('form1', {static: true}) public asd: ElementRef;
  @ViewChild('form2') public formContainer2: EngDynamicFormsComponent;

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
    this.searchFormConfig = {
      showReset: true,
      resetIcon: 'delete',
      resetLabel: 'Reset',
      resetCallback: (f: NgForm) => {
        this.applyFilter();
        this.dataTableService.setData('table1', [
          {
            "id": 1,
            "first_name": "Sgracchio",
            "last_name": "Tuting",
            "email": "dtuting0@dropbox.com"
          },
          {
            "id": 2,
            "first_name": "Pirito",
            "last_name": "Egger",
            "email": "hegger1@soup.io"
          },
          {
            "id": 3,
            "first_name": "Morvo",
            "last_name": "Fennelly",
            "email": "efennelly2@ucoz.com"
          },
          {
            "id": 4,
            "first_name": "Brontolo",
            "last_name": "Tuting",
            "email": "dtuting0@dropbox.com"
          },
          {
            "id": 5,
            "first_name": "Pisolo",
            "last_name": "Egger",
            "email": "hegger1@soup.io"
          },
          {
            "id": 6,
            "first_name": "Eolo",
            "last_name": "Fennelly",
            "email": "efennelly2@ucoz.com"
          },
          {
            "id": 7,
            "first_name": "Mammolo",
            "last_name": "Tuting",
            "email": "dtuting0@dropbox.com"
          },
          {
            "id": 8,
            "first_name": "Cucciolo",
            "last_name": "Egger",
            "email": "hegger1@soup.io"
          },
          {
            "id": 9,
            "first_name": "Dotto",
            "last_name": "Fennelly",
            "email": "efennelly2@ucoz.com"
          }
        ])
      },
      showSubmit: true,
      submitIcon: 'search',
      submitLabel: 'Submit',
      submitCallback: (f: NgForm) => {
        alert('Submit!');
        this.applyFilter();
      }
    };

    this.setSearchForm();
  }

  ngOnInit() {
    // if (!!this.formContainer) {
    //   this.formContainer.formReadyEvent.subscribe(f => {
    //     this.formRef = f;
    //     f.setValue({patatefritte: '1593100365196'});
    //   });
    // }

    this.datepickerService.registerFilter('diVenereEDiMarte', this.filterDatePicker)
  }

  public filterDatePicker(d: Date): boolean {
    const day = d.getDay();
    return day !== 2 && day !== 5;
  }

  ngAfterViewInit(): void {
    this.formContainer.formReadyEvent.subscribe(f => {
      this.formRef = f;
    })
    this.changeDetectorRef.detectChanges();
  }

  applyFilter() {
  }

  resetFormValue() {
    this.formRef.reset({});
  }

  setSearchForm() {
    this.searchForm = {
      "components": [
        {
          "type": "select",
          "label": "Esito Istruttoria",
          "key": "esito",
          "dataSrc": "values",
          "data": {
            "values": [
              {
                "value": null,
                "label": ""
              },
              {
                "value": "A",
                "label": "Istruttoria con esito positivo"
              },
              {
                "value": "I",
                "label": "Richiesta di integrazioni"
              },
              {
                "value": "R",
                "label": "Istruttoria con esito negativo"
              }
            ]
          },
          "validate": {
            "required": true
          }
        },
        {
          "type": "textarea",
          "label": "Note pubbliche",
          "key": "notePubbliche",
          "validate": {
            "required":  "[{\"!\":[{\"==\":[{\"var\":\"esito\"},\"A\"]}]}]"
          }
        },
        {
          "type": "textarea",
          "label": "Note interne",
          "key": "notePrivate"
        },
        {
          "key": "esitoPdf",
          "type": "file",
          "label": "Carica PDF firmato",
          "downloadFile": "#",
          "target": "/documento/esito/integrazioni/{idIstanza}",
          "deleteUrl": "",
          "hidden": "[{\"and\":[{\"!=\":[{\"var\":\"esito\"},\"I\"]},{\"!=\":[{\"var\":\"esito\"},\"R\"]}]}]",
          "singleUpload": true,
          "validate": {
            "required": true,
            "pattern": ".pdf",
            "custom": ""
          },
          "suffix": "",
          "defaultValue": null,
          "input": true,
          "data": {},
          "disabled": false
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
    console.log(this.formRef.valid);
    this.uploadService.setDownload("esitoPdf", "http://www.google.com");
  }

  post1() {
    this.httpClient.post("https://reqres.in/api/users", {
      "name": "morpheus",
      "job": "leader"
    }).subscribe((value => {
      console.log(value)
    }))
  }

  post2() {
    this.httpClient.post("https://reqres.in/api/users", {
      "name": "tamatrz",
      "job": "tm3"
    }).subscribe((value => {
      console.log(value)
    }))
  }
}
