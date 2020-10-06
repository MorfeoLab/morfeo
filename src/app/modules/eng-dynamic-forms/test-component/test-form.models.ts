import {IForm, IFormElement} from '../shared/models/form-element.model';

export const FORM_T: IForm = {
  components: [
    {
      key: 'RICHIEDENTE.DATA_NASCITA',
      label: 'Data di nascita',
      localizedLabel: {
        it: 'Data di nascita'
      },
      type: 'file',
      data: {
        values: []
      },
      suffix: '',
      validate: {
        pattern: '^[a-zA-Z0-9\\-_\\.]+\\.(([Pp][Dd][Ff]\\.[Pp]7[Mm])|([Pp][Dd][Ff])|([Xx][Mm][Ll])|([Dd][Ww][Ff]\\.[Pp]7[Mm])|([Dd][Ww][Ff])|([Ss][Vv][Gg]\\.[Pp]7[Mm])|([Ss][Vv][Gg])|([Jj][Pp][Gg]\\.[Pp]7[Mm])|([Jj][Pp][Gg]))$|^.*\\.([Zz][Ii][Pp])$',
        required: true
      },
      defaultValue: null,
      input: false
    }
]
}

export const TEST_FORM_2: IForm ={
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
