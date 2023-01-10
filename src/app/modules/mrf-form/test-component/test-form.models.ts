import {IForm, IFormElement} from '../shared/models/form-element.model';

export const TEST_SELECT_COMPONENT: IFormElement = {
  label: 'Select example',
  key: 'select',
  type: 'select',
  fullValue: true,
  validate: {
    required: true,
    custom: ''
  },
  defaultValue: null,
  hidden: false,
  data: {
    url: '/assets/data/stati.json?altraSelect=$altraSelect',
    values: [],
    configurableParams: {
      $altraSelect: 'select_2'
    }
  },
  dataSrc: 'url',
  valueProperty: 'codice',
  labelProperty: 'descrizione',
  suffix: '',
  input: true
};

export const TEST_SELECT_COMPONENT_2: IFormElement = {
  label: 'Select example',
  key: 'select_2',
  type: 'select',
  fullValue: true,
  validate: {
    required: true,
    custom: ''
  },
  defaultValue: null,
  hidden: false,
  data: {
    url: '/assets/data/stati.json',
    values: []
  },
  dataSrc: 'url',
  valueProperty: 'codice',
  labelProperty: 'descrizione',
  suffix: '',
  input: true
};

export const TEST_SELECT_COMPONENT_3: IFormElement = {
  label: 'Select example',
  key: 'select_3',
  type: 'select',
  validate: {
    required: true,
    custom: ''
  },
  defaultValue: null,
  hidden: false,
  data: {
    url: '/assets/data/stati.json',
    values: []
  },
  dataSrc: 'url',
  valueProperty: 'codice',
  labelProperty: 'descrizione',
  suffix: '',
  input: true
};

export const TEST_SELECT_FORM: IForm = {
  components: [
    TEST_SELECT_COMPONENT,
    TEST_SELECT_COMPONENT_2,
    TEST_SELECT_COMPONENT_3
  ]
};

export const TEST_DATETIME_COMPONENT: IFormElement = {
  key: 'date',
  label: 'Data',
  type: 'datetime',
  hidden: false,
  validate: {
    required: true,
    custom: '[{">=":[{"var":"date"}, "2021-11-30T10:31:04.692Z"]}]',
    messages: {
      custom: 'Scegliere una data precedente al 30/11/2021'
    }
  },
  suffix: '',
  timePicker: false,
  defaultValue: '2021-11-30T10:31:04.692Z',
  input: true,
  data: {}
};

export const TEST_DATETIME_COMPONENT_2: IFormElement = {
  key: 'date-2',
  label: 'Data e ora',
  type: 'datetime',
  hidden: false,
  validate: {
    required: true,
    custom: '[{">=":[{"var":"date-2"}, "2021-11-30T10:31:04.692Z"]}]',
    messages: {
      custom: 'Scegliere una data precedente al 30/11/2021'
    }
  },
  suffix: '',
  timePicker: true,
  defaultValue: '2021-11-30T10:31:04.692Z',
  input: true,
  data: {}
};

export const TEST_DATETIME_COMPONENT_3: IFormElement = {
  key: 'date-3',
  label: 'Data e ora una settimana dopo',
  type: 'datetime',
  hidden: false,
  validate: {
    required: true,
    custom: '[{">=":[{"var":"date-2"}, "2021-11-30T10:31:04.692Z"]}]',
    messages: {
      custom: 'Scegliere una data precedente al 30/11/2021'
    }
  },
  suffix: '',
  timePicker: true,
  defaultValue: null,
  calculatedValue: '[{"+":[{"var":"date-2"}, "604800"]}]',
  input: true,
  data: {}
};

export const TEST_DATETIME_FORM: IForm = {
  components: [
    TEST_DATETIME_COMPONENT,
    TEST_DATETIME_COMPONENT_2
  ]
};


export const FORM_T: IForm = {
  "components": [{
    "key": "TAB_I_UTG_DOMANDA_BANDI_INFRASTRUTTURE_SC",
    "type": "tabs",
    "components": [{
      "key": "M_MODULO_TIPOLOGIA",
      "label": "MODULO_TIPOLOGIA",
      "localizedLabel": {"it": "Modulo tipologia"},
      "components": [{
        "key": "TAB_M_MODULO_TIPOLOGIA",
        "type": "tabs",
        "components": [{
          "key": "Q_QUADRO_TIPOLOGIA",
          "label": "QUADRO_TIPOLOGIA",
          "localizedLabel": {"it": "Quadro tipologia"},
          "components": [{
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "00002",
                "label": "",
                "type": "htmlelement",
                "components": [],
                "suffix": "",
                "content": {"it": "Seleziona una tipologia di domanda"},
                "validate": {}
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "TIPOLOGIA_DOMANDA",
                "label": "Tipologia domanda",
                "localizedLabel": {"it": "Tipologia domanda"},
                "type": "select",
                "data": {"values": [{"value": "1", "label": "Singolo Ente"}, {"value": "2", "label": "Partenariato"}]},
                "dataSrc": "values",
                "suffix": "",
                "validate": {"custom": ""},
                "labelProperty": "label",
                "valueProperty": "value"
              }]
            }]
          }]
        }],
        "selectedIndex": 0
      }],
      "moduloTecnico": false
    },
      {
      "key": "M_DOMANDA_BANDI_INFRASTRUTTURE_SC",
      "label": "DOMANDA_BANDI_INFRASTRUTTURE_SC",
      "localizedLabel": {"it": "Modulo domanda Bandi Infrastrutture senza compilatore"},
      "components": [{
        "key": "TAB_M_DOMANDA_BANDI_INFRASTRUTTURE_SC", "type": "tabs", "components": [{
          "key": "Q_BANDI_INFRASTRUTTURE_SC_INTESTAZIONE",
          "label": "BANDI_INFRASTRUTTURE_SC_INTESTAZIONE",
          "localizedLabel": {"it": "Intestazione"},
          "components": [{
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "CODICE_BANDO",
                "label": "Codice procedura",
                "localizedLabel": {"it": "Codice procedura"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {"custom": "", "maxLength": 256},
                "disabled": "true"
              }]
            }, {
              "components": [{
                "key": "CUP",
                "label": "CUP",
                "localizedLabel": {"it": "CUP"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {"custom": "", "maxLength": 256},
                "disabled": "true"
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "SYSDATE",
                "label": "Data sistema",
                "localizedLabel": {"it": "Data sistema"},
                "type": "datetime",
                "data": {"values": []},
                "suffix": "",
                "validate": {"custom": ""},
                "disabled": "true"
              }]
            }, {
              "components": [{
                "key": "STATO_DOMANDA",
                "label": "Stato domanda",
                "localizedLabel": {"it": "Stato domanda"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {"custom": "", "maxLength": 256},
                "disabled": "true"
              }]
            }]
          }]
        }, {
          "key": "Q_RICHIEDENTE",
          "label": "RICHIEDENTE",
          "localizedLabel": {"it": "Dati richiedente"},
          "components": [{
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "PROPONENTE.COGNOME",
                "label": "Cognome",
                "localizedLabel": {"it": "Cognome"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {"custom": "", "maxLength": 256}
              }]
            }, {
              "components": [{
                "key": "PROPONENTE.NOME",
                "label": "Nome",
                "localizedLabel": {"it": "Nome"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {"custom": "", "maxLength": 256}
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "PROPONENTE.CODICE_FISCALE",
                "label": "Codice Fiscale",
                "localizedLabel": {"it": "Codice Fiscale"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {
                  "custom": "",
                  "pattern": "^[A-Za-z]{6}[0-9LMNPQRSTUVlmnpqrstuv]{2}[ABCDEHLMPRSTabcdehlmprst][0-9LMNPQRSTUVlmnpqrstuv]{2}[A-Za-z][0-9LMNPQRSTUVlmnpqrstuv]{3}[A-Za-z]$",
                  "maxLength": 256,
                  "required": "true"
                },
                "hidden": "[{\"!\":[{\"!\":[]}]}]"
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "PROPONENTE_NATO_A_STATO",
                "label": "Stato di nascita",
                "localizedLabel": {"it": "Stato di nascita"},
                "type": "autocomplete",
                "data": {
                  "values": [],
                  "url": "/gw/egpal-api-progettocm/bdr/dizionari/altri/stati/1",
                  "method": "GET",
                  "params": {"nome": ""}
                },
                "dataSrc": "url",
                "suffix": "",
                "validate": {"custom": ""},
                "labelProperty": "descrizione",
                "valueProperty": "codice"
              }]
            }, {
              "components": [{
                "key": "PROPONENTE_NATO_A",
                "label": "Nato a",
                "localizedLabel": {"it": "Nato a"},
                "type": "autocomplete",
                "data": {
                  "values": [],
                  "url": "/gw/egpal-api-progettocm/bdr/dizionari/altri/autocomplete/comuni/nascita",
                  "autocompleteType": "server",
                  "method": "GET",
                  "params": {"descrizione": ""},
                  "configurableParams": {"siglaProvincia": ""},
                  "mapFieldToFormKey": {"codiceBelfiore": "", "siglaProvincia": ""}
                },
                "dataSrc": "url",
                "suffix": "",
                "validate": {"custom": ""},
                "labelProperty": "descrizione",
                "valueProperty": "codice"
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "PROPONENTE_NATO_A_PROV",
                "label": "Provincia",
                "localizedLabel": {"it": "Provincia"},
                "type": "select",
                "data": {
                  "values": [],
                  "url": "/gw/egpal-api-progettocm/bdr/dizionari/altri/autocomplete/province",
                  "autocompleteType": "server",
                  "method": "GET",
                  "params": {"descrizione": ""}
                },
                "dataSrc": "url",
                "suffix": "",
                "validate": {"custom": ""},
                "labelProperty": "descrizione",
                "valueProperty": "sigla"
              }]
            }, {
              "components": [{
                "key": "PROPONENTE_DATA_DI_NASCITA",
                "label": "Data di nascita",
                "localizedLabel": {"it": "Data di nascita"},
                "type": "datetime",
                "data": {"values": []},
                "suffix": "",
                "validate": {"custom": ""}
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "00000",
                "label": "",
                "type": "htmlelement",
                "components": [],
                "suffix": "",
                "content": {"it": "<b>Dati Residenza</b>"},
                "validate": {}
              }]
            }]
          }]
        }, {
          "key": "Q_DATI_ENTE",
          "label": "DATI_ENTE",
          "localizedLabel": {"it": "Dati Ente di Riferimento"},
          "components": [{
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "PROPONENTE_PG.RAGIONE_SOCIALE",
                "label": "Ragione Sociale",
                "localizedLabel": {"it": "Ragione Sociale"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {"custom": "", "maxLength": 256}
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "PROPONENTE_PG.CODICE_FISCALE",
                "label": "Codice Fiscale",
                "localizedLabel": {"it": "Codice Fiscale"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {
                  "custom": "",
                  "pattern": "(^[A-Za-z]{6}[0-9LMNPQRSTUVlmnpqrstuv]{2}[ABCDEHLMPRSTabcdehlmprst][0-9LMNPQRSTUVlmnpqrstuv]{2}[A-Za-z][0-9LMNPQRSTUVlmnpqrstuv]{3}[A-Za-z]$)|(^[0-9]{11}$)",
                  "maxLength": 256
                }
              }]
            }, {
              "components": [{
                "key": "PROPONENTE_PG.P_IVA",
                "label": "Partita IVA",
                "localizedLabel": {"it": "Partita IVA"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {"custom": "", "pattern": "^[0-9]{11}$", "maxLength": 256}
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "00001",
                "label": "",
                "type": "htmlelement",
                "components": [],
                "suffix": "",
                "content": {"it": "<b>LEGALE RAPPRESENTANTE</b>"},
                "validate": {}
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "LEGALE_RAPPRESENTANTE_COGNOME",
                "label": "Cognome",
                "localizedLabel": {"it": "Cognome"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {"custom": "", "maxLength": 256}
              }]
            }, {
              "components": [{
                "key": "LEGALE_RAPPRESENTANTE_NOME",
                "label": "Nome",
                "localizedLabel": {"it": "Nome"},
                "type": "textfield",
                "data": {"values": []},
                "validate": {"custom": "", "maxLength": 256}
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "LEGALE_RAPPRESENTANTE_CODICE_FISCALE",
                "label": "Codice Fiscale",
                "localizedLabel": {"it": "Codice Fiscale"},
                "type": "textfield",
                "validate": {
                  "custom": "",
                  "pattern": "^[A-Za-z]{6}[0-9LMNPQRSTUVlmnpqrstuv]{2}[ABCDEHLMPRSTabcdehlmprst][0-9LMNPQRSTUVlmnpqrstuv]{2}[A-Za-z][0-9LMNPQRSTUVlmnpqrstuv]{3}[A-Za-z]$",
                  "maxLength": 256
                }
              }]
            }]
          }, {
            "key": "columns",
            "label": "Nome del Quadro",
            "type": "columns",
            "columns": [{
              "components": [{
                "key": "LEGALE_RAPPRESENTANTE_DATA_NASCITA",
                "label": "Data di nascita",
                "localizedLabel": {"it": "Data di nascita"},
                "type": "datetime",
                "data": {"values": []},
                "suffix": "",
                "validate": {"custom": ""}
              }]
            }]
          }]
        }], "selectedIndex": 0
      }],
      "hidden": "[{\"!\":[{\"==\":[{\"var\":\"TIPOLOGIA_DOMANDA\"},\"1\"]}]}]",
      "moduloTecnico": false
    }],
    "selectedIndex": 0
  }]
};

export const TEST_FORM_2: IForm = {
  components: [
    {
      type: 'columns',
      columns: [
        {
          components: [
            {
              type: 'textfield',
              key: 'id',
              hidden: true
            },
            {
              type: 'textfield',
              key: 'coordinatore',
              hidden: true
            },
            {
              type: 'textfield',
              key: 'cognome',
              label: 'Cognome',
              validate: {
                required: true
              }
            }
          ]
        },
        {
          components: [
            {
              type: 'textfield',
              key: 'nome',
              label: 'Nome',
              validate: {
                required: true
              }
            }
          ]
        },
        {
          components: [
            {
              type: 'textfield',
              key: 'codiceFiscale',
              label: 'Codice Fiscale',
              validate: {
                required: true,
                minLength: 16,
                maxLength: 16
              }
            }
          ]
        }
      ]
    },
    {
      type: 'columns',
      columns: [
        {
          components: [
            {
              type: 'email',
              key: 'email',
              label: 'Indirizzo email',
              validate: {
                required: true,
                custom: '[{"regex": ["@", {"var":"email"}]}]'
              },
            }
          ]
        },
        {
          components: [
            {
              type: 'textfield',
              key: 'cellulare',
              label: 'Numero di telefono cellulare',
              validate: {
                required: true
              },
            }
          ]
        }
      ]
    }
  ]
};

export const TEST_FORM: IForm = {
  components: [
    {
      key: 'SWITCH',
      label: 'Visualizza componente:',
      type: 'select',
      data: {
        values: [
          {
            value: 'actionbutton',
            label: 'Action Button'
          },
          {
            value: 'autocomplete',
            label: 'Autocomplete'
          },
          {
            value: 'button',
            label: 'Button'
          },
          {
            value: 'bdButton',
            label: 'BD Button'
          },
          {
            value: 'checkbox',
            label: 'Checkbox'
          },
          {
            value: 'chips',
            label: 'Chips'
          },
          {
            value: 'columns',
            label: 'Columns'
          },
          {
            value: 'container',
            label: 'Container'
          },
          {
            value: 'datetime',
            label: 'Date picker'
          },
          {
            value: 'email',
            label: 'Email'
          },
          {
            value: 'fieldset',
            label: 'Fieldset'
          },
          {
            value: 'file',
            label: 'File'
          },
          {
            value: 'htmlelement',
            label: 'What you see is what you get'
          },
          {
            value: 'htmlbox',
            label: 'Box'
          },
          {
            value: 'jsonRule',
            label: 'JSON Rule'
          },
          {
            value: 'jsonRulesList',
            label: 'JSON Rule'
          },
          {
            value: 'map',
            label: 'Map'
          },
          {
            value: 'mapHtml',
            label: 'Map HTML'
          },
          {
            value: 'multiLang',
            label: 'Multi language'
          },
          {
            value: 'number',
            label: 'Number'
          },
          {
            value: 'objectList',
            label: 'Object List'
          },
          {
            value: 'objectList2',
            label: 'Object List 2'
          },
          {
            value: 'objectListModuli',
            label: 'Object List Moduli'
          },
          {
            value: 'panel',
            label: 'Panel'
          },
          {
            value: 'parixgate',
            label: 'Parix Gate'
          },
          {
            value: 'password',
            label: 'Password'
          },
          {
            value: 'phoneNumber',
            label: 'Numero di telefono'
          },
          {
            value: 'radio',
            label: 'Pulsanti radio'
          },
          {
            value: 'repeatable',
            label: 'Blocco ripetibile'
          },
          {
            value: 'select',
            label: 'Select'
          },
          {
            value: 'selectboxes',
            label: 'Checkbox multipli'
          },
          {
            value: 'table',
            label: 'Tabella'
          },
          {
            value: 'tabs',
            label: 'Tab'
          },
          {
            value: 'textarea',
            label: 'Area di testo'
          },
          {
            value: 'textfield',
            label: 'Campo di testo'
          },
          {
            value: 'well',
            label: 'Contenitore generico'
          }
        ]
      },
      dataSrc: 'values',
      suffix: '',
    },
    getControl('ACTIONBUTTON1', 'actionbutton', true),
    getControl('AUTOCOMPLETE1', 'autocomplete', true),
    // getControl('AUTOCOMPLETE1', 'autocomplete', false),
    getControl('BUTTON1', 'button', true),
    getControl('BDBUTTON1', 'bdButton', true),
    getControl('CHECKBOX1', 'checkbox', true),
    // getControl('CHECKBOX1', 'checkbox', false),
    getControl('CHIPS1', 'chips', true),
    getControl('COLUMNS1', 'columns', true),
    getControl('CONTAINER1', 'container', true),
    getControl('DATETIME1', 'datetime', true),
    // getControl('DATETIME1', 'datetime', false),
    getControl('EMAIL1', 'email', true),
    getControl('EMAIL1', 'email', false),
    getControl('FIELDSET1', 'fieldset', true),
    getControl('FILE1', 'file', true),
    getControl('HTMLELEMENT1', 'htmlelement', true),
    getControl('HTMLBOX1', 'htmlbox', true),
    getControl('JSONRULE1', 'jsonRule', true),
    getControl('JSONRULESLIST1', 'jsonRulesList', true),
    getControl('MAP1', 'map', true),
    // getControl('MAP1', 'map', false),
    getControl('MAPHTML1', 'mapHtml', true),
    // getControl('MULTILANG1', 'multiLang', true),
    getControl('NUMBER1', 'number', true),
    getControl('OBJECTLIST1', 'objectList', true),
    getControl('OBJECTLIST21', 'objectList2', true),
    getControl('OBJECTLISTMODULI1', 'objectListModuli', true),
    // getControl('PANEL1', 'panel', true),
    getControl('PARIXGATE1', 'parixgate', true),
    // getControl('PASSWORD1', 'password', true),
    // getControl('PHONENUMBER1', 'phoneNumber', true),
    getControl('RADIO1', 'radio', true),
    // getControl('RADIO1', 'radio', false),
    getControl('REPEATABLE1', 'repeatable', true),
    getControl('SELECT1', 'select', true),
    // getControl('SELECT1', 'select', false),
    getControl('SELECTBOXES1', 'selectboxes', true),
    getControl('TABLE1', 'table', true),
    getControl('TABS1', 'tabs', true),
    getControl('TEXTAREA1', 'textarea', true),
    getControl('TEXTFIELD1', 'textfield', true),
    getControl('WELL1', 'well', true)
  ]
};

function getControl(key: string, type: any, jsonHide: boolean = false): IFormElement {
  const op: IFormElement = {
    key,
    label: key,
    type
  };
  if (jsonHide) {
    op.hidden = getHidden(type);
  }
  switch (type) {
    case 'autocomplete':
      op.data = {values: getValues()};
      op.dataSrc = 'values';
      break;
    case 'chips':
      op.dataSrc = 'values';
      break;
    case 'columns':
      op.columns = [
        {
          components: [
            getControl('CHIPS1', 'chips'),
          ],
        }
      ];
      break;
    case 'container':
      op.components = [
        getControl('CHIPS1', 'chips'),
      ];
      break;
    case 'fieldset':
      op.components = [
        getControl('CHIPS1', 'chips'),
      ];
      break;
    case 'htmlelement':
      op.content = 'Content';
      break;
    case 'htmlbox':
      op.content = 'Content';
      break;
    case 'radio':
      op.values = getValues();
      break;
    case 'select':
      op.data = {values: getValues()};
      op.dataSrc = 'values';
      break;
    default:
      break;
  }
  return op;
}

function getHidden(type: string): string {
  return `[{"!=":[{"var":"SWITCH"},"${type}"]}]`;
}

function getValues(): {
  value: string,
  label: string
}[] {
  return [
    {
      value: 'aaa',
      label: 'aaa'
    }, {
      value: 'bbb',
      label: 'bbb'
    }, {
      value: 'ccc',
      label: 'ccc'
    }, {
      value: 'ddd',
      label: 'ddd'
    }, {
      value: 'eee',
      label: 'eee'
    },
  ];
}
