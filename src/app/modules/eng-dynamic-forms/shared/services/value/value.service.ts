import {Injectable} from '@angular/core';
import {IForm, IFormElement} from '../../models/form-element.model';
import {UtilityService} from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class ValueService {
  /// Una rappresentazione del form ordinata per nome
  private fieldsList: { [key: string]: IFormElement[] } = {};

  constructor(
    private utils: UtilityService
  ) {
  }

  loadForm(f: IForm) {
    if (this.utils.isNullOrUndefined(f)) {
      return;
    }

    let counter = 0;

    const checkElement = (component: IFormElement, parentComponent: IFormElement): void => {
      if (this.utils.isNullOrUndefined(component)) {
        return;
      }
      component.key = component.key || 'anon' + (++counter);
      component.suffix = component.suffix || '';
      component.parent = parentComponent;
      const componentId = component.key + component.suffix;
      this.fieldsList[componentId] = this.fieldsList[componentId] || [];
      this.fieldsList[componentId].push(component);

      if (Array.isArray(component.components)) {
        for (const child of component.components) {
          checkElement(child, component);
        }
      }

      if (Array.isArray(component.columns)) {
        for (const column of component.columns) {
          if (Array.isArray(column.components)) {
            for (const child of column.components) {
              checkElement(child, component);
            }
          }
        }
      }
    };

    if (Array.isArray(f.components)) {
      for (const element of f.components) {
        checkElement(element, f);
      }
    }
  }

  public get visibleCount(): { [key: string]: number } {
    const op = {};
    for (const key in this.fieldsList) {
      if (this.fieldsList.hasOwnProperty(key)) {
        if (Array.isArray(this.fieldsList[key])) {
          let count = 0;
          for (const element of this.fieldsList[key]) {
            if (this.isVisible(element)) {
              count++;
            }
          }
          op[key] = count;
        }
      }
    }
    return op;
  }

  public isVisible(el: IFormElement): boolean {
    if (el.hidden) {
      return false;
    }
    let parent = el.parent;
    while (!!parent) {
      if (parent.hidden) {
        return false;
      }
      parent = parent.parent;
    }
    return true;
  }
}
