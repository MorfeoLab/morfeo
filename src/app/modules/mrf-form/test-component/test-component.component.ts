import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IForm, IFormAjaxResponse, IFormOptions } from '../shared/models/form-element.model';
import { TabsService } from '../shared/services/tabs/tabs.service';
import { MrfFormComponent, FormContainerConfig } from '../mrf-form.component';
import { DataService } from '../shared/services/data-service/data-service.service';
import { DataTableService } from '../shared/services/data-table-service/data-table.service';
import { DatepickerService } from '../shared/services/datepicker-service/datepicker.service';
import { UploaderService } from '../shared/services/uploader.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/mode/markdown/markdown';

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
    csvString: string;
    jsonString: string;
    xmlString: string;
    codeEditorCsv: IForm;
    codeEditorJson: IForm;
    codeEditorXml: IForm;
    input: IForm;
    objectElement: IForm;
    repeatable: IForm;
    textFieldTest: IForm;

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

        this.setCodeEditorForm();

        this.setRepeatableForm();

        this.setTextFieldTest();

        this.setInputFieldTest();

    }

    public setInputFieldTest()  {
      this.input = {
        components: [
          {
            key: "codeEditorXmlKey",
            type: "image",
            defaultValue: "https://media.newyorker.com/photos/5d0be56fe140839b70c68120/master/pass/Phillips-Neon-Genesis-Evangelion.jpg",
            readOnly: false,
            label: "prova",
          }
        ]
      };
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        // this.formContainer.formReadyEvent.subscribe(f => {
        //     this.formRef = f;
        // })
        // this.changeDetectorRef.detectChanges();
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
            "components": [
                {
                    "type": "dataTable",
                    "key": "autorizzazioniTable",
                    "hideLoader": true,
                    "dataSrc": "url",
                    "data": {
                        "url": "/gw/api/cpistruttoria/istanze/domande/$filter",
                        "values": [],
                        "pagination": {
                            "sizeOptions": [
                                5,
                                10,
                                15
                            ]
                        },
                        "filter": {
                            "components": [
                                {
                                    "label": "Data",
                                    "key": "date",
                                    "type": "datetime",
                                    "validate": {
                                        "required": false
                                    }
                                }
                            ]
                        },
                        "columns": [
                            {
                                "value": "codice",
                                "label": "Codice"
                            },
                            {
                                "value": "area",
                                "label": "Area",
                                "sortable": true
                            },
                            {
                                "value": "ambito",
                                "label": "Ambito"
                            },
                            {
                                "value": "sede",
                                "label": "Sede",
                                "sortable": true
                            },
                            {
                                "value": "tipoProcedimento",
                                "label": "Tipo Procedimento"
                            },
                            {
                                "value": "dataPresentazione",
                                "label": "Data Presentazione",
                                "sortable": true
                            },
                            {
                                "value": "numeroProtocollo",
                                "label": "Numero Protocollo"
                            },
                            {
                                "value": "dataProtocollo",
                                "label": "Data Protocollo",
                                "sortable": true
                            },
                            {
                                "value": "statoIstanza",
                                "label": "Stato",
                                "sortable": true
                            },
                            {
                                "value": "cognomeRichiedente",
                                "label": "Cognome"
                            },
                            {
                                "value": "nomeRichiedente",
                                "label": "Nome",
                                "sortable": true
                            },
                            {
                                "value": "dataNascitaRichiedente",
                                "label": "Data Nascita"
                            },
                            {
                                "value": "codiceFiscaleRichiedente",
                                "label": "Codice Fiscale",
                                "sortable": true
                            },
                            {
                                "value": "tools",
                                "label": "",
                                "renderer": "showButtonsByStatus",
                                "style": {
                                    "align": "right"
                                },
                                "buttons": [
                                    {
                                        "label": "Modifica",
                                        "icon": "edit",
                                        "action": "edit",
                                        "color": "primary",
                                        "style": "icon"
                                    }
                                ]
                            }
                        ]
                    },
                    "suffix": "",
                    "hidden": false,
                    "defaultValue": null,
                    "validate": {
                        "custom": ""
                    },
                    "input": true
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

    // Code editor component
    // CODE EDITOR
  setCodeEditorForm() {
    this.csvString = "test,test,test,' spazi ',test test,dd"
    this.jsonString = "{\"glossary\":{\"title\":\"exampleglossary\",\"GlossDiv\":{\"title\":\"S\",\"GlossList\":{\"GlossEntry\":" +
      "{\"ID\":\"SGML\",\"SortAs\":\"SGML\",\"GlossTerm\":\"StandardGeneralizedMarkupLanguage\",\"Acronym\":\"SGML\",\"Abbrev\":" +
      "\"ISO8879:1986\",\"GlossDef\":{\"para\":\"Ameta-markuplanguage,usedtocreatemarkuplanguagessuchasDocBook.\",\"GlossSeeAlso" +
      "\":[\"GML\",\"XML\"]},\"GlossSee\":\"markup\"}}}}}";
    this.xmlString = "<?xmlversion='1.0'encoding='UTF-8'?><note><to>Tove</to><from>Jani</from><heading>Reminder</heading><bb>Don" +
      "'t forget me this weekend!</bb></note>";

    this.codeEditorCsv = {
      components: [
        {
          key: "codeEditorCsvKey",
          type: "codeEditor",
          defaultValue: this.csvString,
          readOnly: false,
          label: 'Label text',
          codeEditorOptions: {
            mode: 'csv',
            indentDefaultValue: true,
            indentSize: 2,
            showLineNumbers: false,
          },
        }
      ]
    };

    this.codeEditorJson = {
      components: [
        {
          key: "codeEditorJsonKey",
          type: "codeEditor",
          defaultValue: this.jsonString,
          readOnly: false,
          codeEditorOptions: {
            mode: 'json',
            indentDefaultValue: true,
            indentSize: 2,
            showLineNumbers: true,
          },
        }
      ]
    };

    this.codeEditorXml = {
      components: [
        {
          key: "codeEditorXmlKey",
          type: "codeEditor",
          defaultValue: this.xmlString,
          readOnly: false,
          label: 'label XML',
          codeEditorOptions: {
            mode: 'xml',
            indentDefaultValue: true,
            indentSize: 2,
            showLineNumbers: false,
          },
        }
      ]
    };



  }

    // Repeatable initial values
    public setRepeatableForm(): void {

      this.repeatable = {
        components: [
          {
            key: "repeatableKey",
            type: "repeatable",
            data: { values: [] },
            readOnly: false,
            emptyRepeatable: true,
            components: [
              {
                key: "columns",
                type: "columns",
                columns: [
                  {
                    components: [
                      {
                        label: "Campo 1",
                        key: "campo1",
                        type: "textfield",
                        suffix: ""
                      }
                    ]
                  },
                  {
                    components: [
                      {
                        label: "Campo 2",
                        key: "campo2",
                        type: "textfield",
                        suffix: ""
                      }
                    ]
                  }
                ],
                suffix: ""
              }
            ],
          }
        ]
      };
      // this.repeatable = {
      //   components: [
      //     {
      //       key: "repeatableKey",
      //       type: "repeatable",
      //       data: { values: [
      //         {
      //           campo1: 'hello',
      //           campo2: 'pizza'
      //         },
      //         {
      //           campo1: 'hello2',
      //           campo2: 'pizza2'
      //         },
      //       ]},
      //       readOnly: false,
      //       components: [
      //         {
      //           key: "columns",
      //           type: "columns",
      //           columns: [
      //             {
      //               components: [
      //                 {
      //                   label: "Campo 1",
      //                   key: "campo1",
      //                   type: "textfield",
      //                   suffix: ""
      //                 }
      //               ]
      //             },
      //             {
      //               components: [
      //                 {
      //                   label: "Campo 2",
      //                   key: "campo2",
      //                   type: "textfield",
      //                   suffix: ""
      //                 }
      //               ]
      //             }
      //           ],
      //           suffix: ""
      //         }
      //       ],
      //     }
      //   ]
      // };

    }

    public setTextFieldTest(): void {
      this.textFieldTest = {
        "components": [
          {
            "key": "text1",
            "type": "textfield",
            "label": "Campo di testo",
            "placeholder": "Inserisci un testo",
            "hidden": false,
            "defaultValue": "Valore di default1",
            "disabled": true,
            "readOnly": false,
            "validate": {
              "required": false,
              "minLength": "",
              "maxLength": "",
              "custom": ""
            },
            "suffix": "",
            "input": true,
            "data": {}
          },
          {
            "key": "text2",
            "type": "textfield",
            "label": "Campo di testo",
            "placeholder": "Inserisci un testo",
            "hidden": false,
            "defaultValue": "Valore di default2",
            "disabled": false,
            "readOnly": false,
            "validate": {
              "required": false,
              "minLength": "",
              "maxLength": "",
              "custom": ""
            },
            "suffix": "",
            "input": true,
            "data": {}
          }
        ]
      }
    }

}
