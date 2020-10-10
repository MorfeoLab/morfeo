import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IFormElement, IFormOptions} from '../../shared/models/form-element.model';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {FormControl, NgForm} from '@angular/forms';
import {DataService} from '../../shared/services/data-service/data-service.service';

@Component({
  selector: 'mrf-json-rule-element',
  templateUrl: './json-rule-element.component.html',
  styleUrls: ['./json-rule-element.component.scss']
})
export class JsonRuleElementComponent implements OnInit, AfterViewInit {
  /**
   * Modello JSON per il disegno del campo
   */
  @Input() field: IFormElement;


  @Input() readOnly: boolean;
  /**
   * Riferimento al form che contiene questo controllo
   */
  @Input() formRef: NgForm;
  /**
   * La regola in formato Array
   */
  @Input() dataSource: JsonLogicNode[];
  /**
   * Event emitter per quando cambia il valore
   */
  @Output() aggiornaValore = new EventEmitter<JsonLogicNode[]>();
  /**
   * Un JSON che rappresenta l'alberatura dei componenti visibili
   */
  public dataForm: JsonLogicInput[] = [];
  /**
   * Elenco di tutte le espressioni supportate
   */
  public expressions: OptionGroup[] = expressions;
  /**
   * Elenco filtrato di tutte le opzioni per l'autocomplete
   */
  public filteredOptions: any[];
  /**
   * Hidden field for real value
   */
  hiddenControl: FormControl;
  hiddenControlVal: string;

  constructor(
    private utility: UtilityService,
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    /**
     * Se il suffix non è impostato poi ci troviamo "undefined"
     */
    this.field.suffix = this.field.suffix || '';
  }

  ngAfterViewInit() {
    /**
     * Recupero un riferimento all'AbstractControl dell'input hidden
     */
    this.hiddenControl =
      this.hiddenControl ||
      (this.formRef.controls[
      this.field.key + this.field.suffix
        ] as FormControl);

    /**
     * Registra un listener per il campo hidden
     */
    this.registerHiddenFieldListener();
  }

  /**
   * Aggiunge un nodo di regole a dataForm
   */
  addJsonLogicInputToArray(node: JsonLogicInput = null) {
    let array = this.dataForm;
    if (!this.utility.isNullOrUndefined(node)) {
      array = node.children;
    }
    array = array || [];
    array.push(this.getDefaultNode());
    this.saveChanges();
  }

  applyFilter(filtro: string) {
    if (!!filtro && filtro.length > 2) {
      let filterFields: any = {};
      filterFields.codice = filtro;
      // aggiungo la gestione del campo params dove possono essere passati valori da aggiungere in query params
      // serve in primis per passare l'idProgettoDiCambiamento
      filterFields = {...filterFields, ...this.field.data.params};
      if (this.field.dataSrc === 'url') {
        /// Qui l'autocomplete chiama un servizio
        this.dataService.getPaginatedList(this.field.data.url, 0, 30, undefined, undefined, filterFields).subscribe(
          (data: any) => {
            this.filteredOptions = data.elements.map(i => i.morfeoJson);
          }
        );
      } else {
        /// Qui l'autocomplete funziona su un elenco statico di valori
        this.dataService.currentDomande.subscribe(v => {
          this.filteredOptions = v.map(i => {
            return {
              key: i.value,
              label: i.label
            };
          }).filter(i => (i.key.toLowerCase().includes(filtro.toLowerCase())));
        });
      }
    }
  }

  /**
   * Filtro per autocomplete
   */
  autoCompleteMe(event) {
    if (event.key.length === 1) {
      this.applyFilter(event.target.value);
    }
  }

  /**
   * Callback per selezione su autocomplete
   */
  autocompleteOptionSelected($event, node) {
    node.value = $event.option.value.key;
    this.saveChanges();
  }

  /**
   * Reimposta i figli di un nodo ai valori predefiniti in base all'espressione
   */
  resetChildren(node: JsonLogicInput) {
    /// Elenco di espressioni che non hanno figlicond
    const unlimitedChildrenGroup: string[] = ['and', 'or', '+', '*', '()'];
    const twoChildrenGroup: string[] = ['inSelectBoxes', '==', '!=', '<', '<=', '>', '>=', '-', '/'];
    const oneChildGroup: string[] = ['regex', '!!', '!', 'not'];
    const noChildrenGroup: string[] = ['var', 'lit'];
    node.children = [];
    if (noChildrenGroup.indexOf(node.expression) >= 0) {
      /// va bene []
    } else if (twoChildrenGroup.indexOf(node.expression) >= 0) {
      /// Due figli, uno literal e uno field
      node.children.push(this.getDefaultNode('var'));
      node.children.push(this.getDefaultNode('lit'));
    } else if (oneChildGroup.indexOf(node.expression) >= 0) {
      /// Un figlio, un field
      node.children.push(this.getDefaultNode('var'));
    } else if (unlimitedChildrenGroup.indexOf(node.expression) >= 0) {
      /// Non è il caso di inserire valori di default
    }
  }

  /**
   * Devo visualizzare il pulsante di aggiunte figli?
   */
  canAddChild(node): boolean {
    let numChildren = 0;
    const unlimitedChildrenGroup: string[] = ['and', 'or', '+', '*'];
    const twoChildrenGroup: string[] = ['inSelectBoxes', '==', '!=', '<', '<=', '>', '>=', '-', '/'];
    const noChildrenGroup: string[] = ['var', 'lit'];
    const oneChildGroup: string[] = ['regex', '!!', '!', 'not'];
    if (node.hasOwnProperty('children')) {
      numChildren = node.children.length;
    }

    if (noChildrenGroup.indexOf(node.expression) >= 0) {
      node.children = [];
      return false;
    } else if (oneChildGroup.indexOf(node.expression) >= 0) {
      node.children = node.children || [];
      if (numChildren > 1) {
        node.children = node.children.slice(0, 1);
      }
      return node.children.length < 1;
    } else if (twoChildrenGroup.indexOf(node.expression) >= 0) {
      node.children = node.children || [];
      if (numChildren > 2) {
        node.children = node.children.slice(0, 2);
      }
      return node.children.length < 2;
    } else if (unlimitedChildrenGroup.indexOf(node.expression) >= 0) {
      node.children = node.children || [];
      return true;
    }
    return false;
  }

  cleanValue($event) {
    $event.target.value = '';
  }

  /**
   * Converte un JSON compatibile con i Form in un JSON compatibile con JsonLogic
   * @param source un array di campi per il Form
   * @return un array di regole JsonLogic
   */
  convertFormToSource(source: JsonLogicInput[]): JsonLogicNode[] | null {
    let resultNode: JsonLogicNode[] | null = null;
    if (!Array.isArray(source)) {
      source = [source];
    }
    for (const field of source) {
      if (!!field) {

        let currentNode: JsonLogicNode | string = {};
        if (field.expression === 'regex') {
          (currentNode as any)[field.expression] = [field.value, ...this.convertFormToSource(field.children)];
        } else if (['lit', 'var'].indexOf(field.expression) < 0) {
          if (!field.value) {
            field.value = '';
          }
          (currentNode as any)[field.expression] = this.convertFormToSource(field.children);
        } else {
          field.value = field.value || '';
          if (field.expression === 'lit') {
            currentNode = field.value.toString();
            // currentNode = field.value.toLowerCase();
          } else {
            if (typeof field.value === 'string') {
              (currentNode as any)[field.expression] = field.value.toString();
            } else if ((field.value as object).hasOwnProperty('key')) {
              (currentNode as any)[field.expression] = (field.value as { key: string }).key;
            }
          }
        }
        if (resultNode === null) {
          resultNode = [];
        }
        (resultNode as JsonLogicNode[]).push(currentNode);
      }
    }
    return resultNode;
  }

  /**
   * Converte un JSON compatibile con JsonLogic in un JSON compatibile con i Form
   * @param source un array di regole JsonLogic
   * @return un array di campi per il Form
   */
  convertSourceToForm(source: JsonLogicNode[] | string): JsonLogicInput[] {
    if (typeof source === 'string') {
      if (this.utility.isJSON(source)) {
        source = JSON.parse(source);
      } else {
        source = [];
      }
    }
    const resultInput: JsonLogicInput[] = [];

    for (const node of source) {
      if (typeof node === 'string') {
        const currentField: JsonLogicInput = {
          expression: 'lit',
          value: node,
          children: []
        };
        resultInput.push(currentField);
      } else {
        for (const expression in (node as any)) {
          if (node.hasOwnProperty(expression)) {
            const currentField: JsonLogicInput = {
              expression: expression as JsonLogicOperator
            };
            if (Array.isArray(node[expression])) {
              if (expression === 'regex') {
                currentField.value = ((node[expression] as JsonLogicNode[]).shift() || '').toString();
              }
              currentField.children = this.convertSourceToForm(node[expression]);
            } else {
              currentField.value = node[expression];
            }
            resultInput.push(currentField);
          }
        }
      }
    }
    return resultInput;
  }

  /**
   * Per Autocomplete
   */
  displayName(elementSelected) {
    if (!!elementSelected) {
      return elementSelected.label;
    }
    return '';
  }

  getDefaultNode(expression: JsonLogicOperator = 'and'): JsonLogicInput {
    return {
      expression,
      value: '', children: []
    };
  }

  registerHiddenFieldListener() {
    this.hiddenControl.valueChanges.subscribe(v => {
      if (!!v) {
        const receivedValueForm = this.convertSourceToForm(v);
        const receivedValueString = JSON.stringify(receivedValueForm);
        const currentValueString = JSON.stringify(this.dataForm);
        if (receivedValueString !== currentValueString) {
          this.dataForm = receivedValueForm;
        }
      }
    });
  }

  /**
   * Rimuove un elemento da un array
   */
  removeItemFromArrayByIndex(a: any[], i: number) {
    if (!Array.isArray(a)) {
      console.warn('Atteso Array, ricevuto ' + (typeof a));
      return;
    }
    if (parseInt(i.toString(), 10) !== i) {
      console.warn('Atteso Integer, ricevuto ' + i);
      return;
    }
    a.splice(i, 1);
    this.saveChanges();
  }

  /**
   * Salva i cambiamenti
   */
  saveChanges() {
    this.dataSource = this.convertFormToSource(this.dataForm);
    this.aggiornaValore.emit(this.dataSource);
    if (this.dataSource === null) {
      this.hiddenControlVal = null;
    } else {
      const stringValue = JSON.stringify(this.dataSource);
      if (this.hiddenControlVal !== stringValue) {
        this.hiddenControlVal = stringValue;
      }
    }
  }

  /**
   * Chiamata quando cambia il valore di una select
   * Inizializza l'array "children" con il numero minimo di nodi figli
   */
  selectionChanged(node) {
    /// Reset children to defaults
    this.resetChildren(node);
    this.saveChanges();
  }

}

type JsonLogicOperator =
  /// Accessing Data
  'var' |
  'lit' |
  /// Logic and boolean
  '==' |
  '!=' |
  '!' |
  '!!' |
  'or' |
  'and' |
  'not' |
  /// Numeric comparison
  '>' |
  '>=' |
  '<' |
  '<=' |
  /// Arithmetic operators
  '+' |
  '-' |
  '*' |
  '/' |
  '%' |
  /// Utils
  '()' |
  'inSelectBoxes' |
  'regex';

/// Questo è il modello per il form
export interface JsonLogicInput {
  expression: JsonLogicOperator;
  value?: string;
  children?: JsonLogicInput[];
  _tempVal1?: string;
  _tempVal2?: string;
}

/// Questo è il modello per la regola da salvare
export type JsonLogicNode = {
  [key in JsonLogicOperator]?: JsonLogicNode[] | string;
} | string;


export interface OptionGroup {
  disabled?: boolean;
  name: string;
  values: IFormOptions[];
}

/**
 * @todo: questo stesso elenco si trova anche su bdm, occorre che sia in un posto solo
 */
const expressions: OptionGroup[] = [
  {
    name: 'Operatori logici',
    values: [
      {
        label: 'AND (congiunzione logica)',
        value: 'and'
      },
      {
        label: 'OR (disgiunzione inclusiva)',
        value: 'or'
      },
      {
        label: 'NOT (falso)',
        value: 'not'
      }
    ]
  },
  {
    name: 'Operatori booleani',
    values: [
      {
        label: 'TRUTY (valorizzato)',
        value: '!!'
      },
      {
        label: 'FALSY (non valorizzato)',
        value: '!'
      }
    ]
  },
  {
    name: 'Operatori logici di confronto',
    values: [
      {
        label: 'IN (ricerca in lista)',
        value: 'inSelectBoxes'
      },
      {
        label: 'EQ (uguaglianza)',
        value: '=='
      },
      {
        label: 'NOT EQ (diseguaglianza)',
        value: '!='
      },
      {
        label: 'REGEX (espressione regolare)',
        value: 'regex'
      }
    ]
  },
  {
    name: 'Operatori numerici di confronto',
    values: [
      {
        label: 'LESS THAN (minore di)',
        value: '<'
      },
      {
        label: 'LESS OR EQ (minore o uguale)',
        value: '<='
      },
      {
        label: 'GREATER THAN (maggiore di)',
        value: '>'
      },
      {
        label: 'GREATER OR EQ (maggiore o uguale)',
        value: '>='
      }
    ]
  },
  {
    name: 'Operatori aritmetici',
    values: [
      {
        label: 'ADD (addizione +)',
        value: '+'
      },
      {
        label: 'SUBTRACT (sottrazione -)',
        value: '-'
      },
      {
        label: 'TIMES (moltiplicazione ×)',
        value: '*'
      },
      {
        label: 'DIVIDE (divisione ÷)',
        value: '/'
      }
    ]
  },
  {
    name: 'Valori',
    values: [
      {
        label: 'VAR (valore di un campo)',
        value: 'var'
      },
      {
        label: 'LIT (valore letterale)',
        value: 'lit'
      }
    ]
  }
];
