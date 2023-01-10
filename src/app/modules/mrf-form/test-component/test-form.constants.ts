import {IForm} from '../shared/models/form-element.model';

// @ts-ignore
export const FORM_DATETIME: IForm = {
    "components": [
        {
            "key": "field1",
            "type": "container",
            "components": [
                {
                    "key": "headerType",
                    "type": "htmlelement",
                    "content": "<h4>Che tipo di elemento vuoi inserire?</h4>"
                },
                {
                    "label": "ricercaOggetti.elencoOggetti.tipo",
                    "key": "type",
                    "type": "select",
                    "validate": {
                        "required": true
                    },
                    "data": {
                        "values": [
                            {
                                "label": "progettiDiCambiamento.categorie.nodo",
                                "value": "nodo"
                            },
                            {
                                "label": "generic.labels.programma",
                                "value": "programma"
                            },
                            {
                                "label": "generic.labels.bando",
                                "value": "bando"
                            },
                            {
                                "label": "generic.labels.procedimento",
                                "value": "procedimento"
                            }
                        ]
                    },
                    "dataSrc": "values"
                }
            ]
        },
        {
            "key": "field2",
            "type": "container",
            "components": [
                {
                    "label": "generic.labels.codice",
                    "key": "codice",
                    "type": "textfield",
                    "validate": {
                        "required": "[{\"!=\":[{\"var\":\"type\"},\"procedimento\"]}]"
                    }
                },
                {
                    "key": "descrizione",
                    "type": "map",
                    "data": {},
                    "label": "generic.labels.descrizione"
                }
            ],
            "hidden": "[{\"==\":[{\"var\":\"type\"},\"procedimento\"]}]"
        },
        {
            "label": "generic.labels.procedimento",
            "key": "idProcedimento",
            "type": "autocomplete",
            "validate": {
                "required": "[{\"==\":[{\"var\":\"type\"},\"procedimento\"]}]"
            },
            "data": {
                "url": "/gw/egpal-api-progettocm//bdr/progetto/cm/procedimenti/",
                "autocompleteType": "server"
            },
            "dataSrc": "url",
            "valueProperty": "id",
            "labelProperty": "codice",
            "hidden": "[{\"!=\":[{\"var\":\"type\"},\"procedimento\"]}]"
        },
        {
            "key": "columnsDateInizio",
            "type": "columns",
            "label": "",
            "columns": [
                {
                    "components": [
                        {
                            "key": "dataInizioVisualizzazione",
                            "label": "progettiDiCambiamento.categorie.dataInizioVisualizzazione",
                            "type": "datetime",
                            "validate": {
                                "required": true,
                                "custom": ""
                            },
                            "suffix": "",
                            "input": true,
                            "timePicker": true
                        }
                    ]
                },
                {
                    "components": [
                        {
                            "key": "dataInizioVisualizzazioneOra",
                            "label": "progettiDiCambiamento.categorie.ore",
                            "type": "textfield",
                            "validate": {
                                "required": true,
                                "pattern": "^((?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$)"
                            },
                            "suffix": "",
                            "input": true,
                            "defaultValue": "00:00:00"
                        }]
                }
            ]
        },
        {
            "key": "columnsDateFine",
            "type": "columns",
            "label": "",
            "columns": [
                {
                    "components": [
                        {
                            "key": "dataFineVisualizzazione",
                            "label": "progettiDiCambiamento.categorie.dataFineVisualizzazione",
                            "type": "datetime",
                            "validate": {
                                "required": true,
                                "custom": "[{\"<=\": [{\"var\":\"dataInizioVisualizzazione\"},{\"var\":\"dataFineVisualizzazione\"}]}]"
                            },
                            "suffix": "",
                            "defaultValue": null,
                            "input": true
                        }
                    ]
                },
                {
                    "components": [
                        {
                            "key": "dataFineVisualizzazioneOra",
                            "label": "progettiDiCambiamento.categorie.ore",
                            "type": "textfield",
                            "validate": {
                                "required": true,
                                "pattern": "^((?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$)"
                            },
                            "suffix": "",
                            "input": true,
                            "defaultValue": "00:00:00"
                        }]
                }
            ]
        },
        {
            "key": "columnsTipoUtente",
            "type": "columns",
            "label": "",
            "columns": [
                {
                    "components": [
                        {
                            "key": "tipoUtente",
                            "label": "progettiDiCambiamento.categorie.tipoUtente",
                            "type": "selectboxes",
                            "values": [
                                {
                                    "label": "Persona Fisica",
                                    "value": "CIT"
                                },
                                {
                                    "label": "Persona giuridica",
                                    "value": "AZI"
                                }
                            ],
                            "dataSrc": "values"
                        }
                    ]
                },
                {
                    "components": [
                        {
                            "key": "tipoPersonaGiuridica",
                            "label": "progettiDiCambiamento.categorie.tipoPersonaGiuridica",
                            "type": "selectboxes",
                            "data": {
                                "url": "/gw/egpal-api-core/api/codifica/findAllValidCodTipoPersonaGiuridica",
                                "method": "GET"
                            },
                            "dataSrc": "url",
                            "valueProperty": "codTipoPersonaGiuridica",
                            "labelProperty": "descrizione",
                            "hidden": "[{\"!\":[{\"inSelectBoxes\": [{\"var\":\"tipoUtente\"},\"AZI\"]}]}]"
                        }
                    ]
                }
            ],
            "hidden": "[{\"!\":[{\"==\": [{\"var\":\"type\"},\"bando\"]}]}]"
        }
    ]
};

export const FORM_SELECTBOXES: IForm = {
    components: [
        {
            label: 'Select example',
            key: 'example-select',
            type: 'select',
            data: {
                values: [
                    {
                        label: 'Opzione 1',
                        value: '001'
                    },
                    {
                        label: 'Opzione 2',
                        value: '002'
                    },
                    {
                        label: 'Opzione 3',
                        value: '003'
                    }
                ]
            },
            dataSrc: 'values',
            valueProperty: 'value',
            labelProperty: 'label',
            fullValue: true
        }
    ]
};

export const FORM_1: IForm = {
    components: [
        {
            type: 'number',
            label: 'UNO',
            key: 'numero1',
            defaultValue: '3',
        },
        {
            type: 'textfield',
            label: 'DUE',
            key: 'numero2',
            calculatedValue: '[{"*":[5,2]}]'
        }
    ]
};

export const FORM_2: IForm = {
    components: [
        {
            type: 'number',
            label: 'TRE',
            key: 'numero3',
            defaultValue: '4',
        },
        {
            type: 'textfield',
            label: 'QUATTRO',
            key: 'numero4',
            calculatedValue: '[{"*":[{"var":"numero3"},2]}]'
        }
    ]
};



export const TEST_FORM: IForm = {
    components: [
        {
            type: 'number',
            key: 'numero',
            label: 'Numero',
            validate: {
                custom: '[{"regex":["^[0-9]+,[0-9][0-9]$", {"var": "numero"}]}]'
            }
        },
        {
            type: 'select',
            key: 'uno',
            label: 'Servizio',
            dataSrc: 'values',
            data: {
                values: [
                    {
                        label: 'User',
                        value: 'users'
                    },
                    {
                        label: 'Posts',
                        value: 'posts'
                    }
                ]
            }
        },
        {
            label: 'Select example',
            key: 'example4',
            type: 'select',
            validate: {
                required: true,
                custom: ''
            },
            defaultValue: null,
            hidden: false,
            content: '(num) => {let op = []; for (let i=0; i<num; i++) {op.push({label: \'User\' + i, value: i})}; return op;}',
            data: {
                url: 'https://jsonplaceholder.typicode.com/$serviceName',
                values: [],
                params: {
                    // $serviceName: 'users',
                    parametroDue: 'Valore DUE'
                },
                configurableParams: {
                    $serviceName: 'uno'
                }
            },
            dataSrc: 'resource',
            valueProperty: 'id',
            labelProperty: 'name',
            suffix: '',
            input: true
        },
        {
            label: 'Select example',
            key: 'example3',
            type: 'select',
            validate: {
                required: true,
                custom: ''
            },
            defaultValue: null,
            hidden: false,
            content: 'funzioneGenerica',
            data: {
                url: 'https://jsonplaceholder.typicode.com/$serviceName',
                values: [],
                params: {
                    // $serviceName: 'users',
                    parametroDue: 'Valore DUE'
                },
                configurableParams: {
                    $serviceName: 'uno'
                }
            },
            dataSrc: 'resource',
            valueProperty: 'id',
            labelProperty: 'name',
            suffix: '',
            input: true
        }
    ]
};

