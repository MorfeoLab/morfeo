import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {RepeatableService} from './repeatable.service';
import {IFormElement} from '../../shared/models/form-element.model';
import * as cloneDeep_ from 'lodash/cloneDeep';
const cloneDeep = cloneDeep_;

@Component({
  selector: 'mrf-repeatable-container',
  templateUrl: './repeatable-container.component.html',
  styleUrls: ['./repeatable-container.component.scss']
})



export class RepeatableContainerComponent implements OnInit, OnDestroy {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() externalData: { [key: string]: any };
  @Input() readOnly: boolean;
  public fields: IFormElement[] = [];
  public count = 0;

  constructor(private repeatableService: RepeatableService) {
  }

  ngOnInit() {
    if (!this.field) {
      return;
    }
    this.field.suffix = this.field.suffix || '';
    this.field.components = this.field.components || [];
    if (
      this.field.components.length !== 1 ||
      this.field.components[0].type !== 'columns'
    ) {
      // il componente ripetibile gestisce un solo figlio dentro un type: columns
      // se vi sono due figli o se il figlio è di tipo sbagliato generiamo una nuova struttura
      this.field.components = [
        {
          type: 'columns',
          columns: [
            {
              components: this.field.components
            }
          ]
        }
      ];
      console.warn('Repeatables should contain only columns components.');
    }
    // Recupero tutti i campi interni
    const childrenKeys = this.getAllChildrenKeys(this.field, true);
    for (const key of childrenKeys) {
      this.repeatableService.add(key, this);
    }
    this.noEmptyRepeatable();
  }

  noEmptyRepeatable(): void {
    const tempArray = this.fields.filter(item => item != null);
    if (!this.fields || !tempArray.length) {
      this.addElement();
    }
  }

  ngOnDestroy(): void {
    // Recupero tutti i campi interni
    const childrenKeys = this.getAllChildrenKeys(this.field, true);
    for (const key of childrenKeys) {
      this.repeatableService.reset(this.formRef, key);
    }
    // this.repeatableService.reset(this.field.key);
  }

  addElement(n: number = 0) {
    n = n || ++this.count;
    const newField: IFormElement =  cloneDeep(this.field.components[0]);
    newField.suffix = newField.suffix || this.field.suffix;
    newField.suffix = newField.suffix + ':' + n;
    this.fields[n] = newField;
    this.count = Math.max(n, this.count);
  }

  deleteElement(element) {
    const index: number = this.fields.indexOf(element);
    if (index >= 0) {
      this.fields.splice(index, 1);
    }
    this.noEmptyRepeatable();
  }

  getAllChildrenKeys(f: IFormElement, includeRepeatables = false): string[] {
    const op: string[] = [];
    if (f.type === 'columns') {
      for (const column of f.columns) {
        for (const component of column.components) {
          op.push(...this.getAllChildrenKeys(component));
        }
      }
    } else if (f.type !== 'repeatable' || includeRepeatables) {
      if (!!f.key && f.type !== 'repeatable') {
        op.push(f.key + this.field.suffix);
      }
      if (Array.isArray(f.components)) {
        for (const component of f.components) {
          op.push(...this.getAllChildrenKeys(component));
        }
      }
    }
    return op;
  }
}
