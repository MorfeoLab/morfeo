import {Injectable} from '@angular/core';
import {IForm, IFormElement} from '../../models/form-element.model';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor() {
  }

  /**
   * Questa funzione confronta due oggetti per determinare se sono equivalenti
   */
  areObjectsEquivalent(a, b) {
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA !== typeB) {
      return false;
    } else if (typeA === 'string' && typeA === 'string') {
      return String(a) === String(b);
    } else if (typeA === 'number' && typeB === 'number') {
      return Number(a) === Number(b);
    } else if (typeA === 'boolean' && typeB === 'boolean') {
      return Boolean(a) === Boolean(b);
    } else if (null === a || null === b) {
      return null === a && null === b;
    } else if (undefined === a || undefined === b) {
      return undefined === a && undefined === b;
    }
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return false;
    }

    for (const propName of aProps) {
      if (!this.areObjectsEquivalent(a[propName], b[propName])) {
        return false;
      }
    }

    return true;
  }

  areEquivalent(obj1: any, obj2: any, idProperty?: string): boolean {
    if (!!idProperty) {
      return (
        obj1.hasOwnProperty(idProperty)
        &&
        obj2.hasOwnProperty(idProperty)
        &&
        obj1[idProperty] === obj2[idProperty]
      );
    } else {
      return this.areObjectsEquivalent(obj1, obj2);
    }
  }

  getObjEquivalentIndex(a: any[], b: any) {
    for (let i = 0; i < a.length; i++) {
      if (this.areObjectsEquivalent(a[i], b)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Check if the string is valid JSON.
   * @source: PrototypeJS
   */
  public isJSON(item) {
    // se è undefined ritorna false
    if (!item) {
      return false;
    }
    if (typeof item === 'string' && item.match(/[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/)) {
      return true;
    }
    // per retrocomptibilità con la precedente versione del metodo gli oggetti vengono considerati alla stregua dei JSON
    return typeof item === 'object';

  }


  /**
   * Questo metodo recupera una porzione JSON che rappresenta un singolo campo in base a KEY
   * @param form
   * @param key
   */
  public getJsonElementByKey(form: IForm, key: string): IFormElement {

    const getChildByKey = (e: any, k: string): IFormElement | null => {
      let iterable: any[] = [];
      if (!!e.components && !!e.components.length) {
        iterable = e.components;
      }
      if (!!e.columns && !!e.columns.length) {
        iterable = e.columns;
      }
      for (const el of iterable) {
        if (el.key === k) {
          return el;
        } else if (el.components || el.columns) {
          const result = getChildByKey(el, k);
          if (!this.isNullOrUndefined(result)) {
            return result;
          }
        }
      }
    };

    return getChildByKey(form, key) as IFormElement;
  }


  /**
   * Questo metodo recupera una porzione JSON che rappresenta un singolo campo in base a KEY
   * @param form
   * @param key
   */
  public getJsonElementByKey2(form: IForm, key: string): IFormElement {

    const getChildByKey = (e: any, k: string): IFormElement | null => {
      let iterable: any[] = [];
      if (!!e.components && !!e.components.length) {
        iterable = e.components;
      }
      if (!!e.columns && !!e.columns.length) {
        iterable = e.columns;
      }
      for (const el of iterable) {
        if (el.type === 'autocomplete') {
          if (k.includes(el.key)) {
            return el;
          }
        }
        if (el.key === k) {
          return el;
        } else if (el.components || el.columns) {
          const result = getChildByKey(el, k);
          if (!this.isNullOrUndefined(result)) {
            return result;
          }
        }
      }
    };

    return getChildByKey(form, key) as IFormElement;
  }


  /**
   * Questo metodo recupera un elenco di key attualmente visibili
   * In caso di key contenute all'interno di componenti ripetibili
   * viene tenuta in considerazione solo la key, senza suffissi
   * @param form IForm
   */
  public getVisibleElementsList(form: IForm): string[] {
    const result = [];

    const getVisibleElements = (components: any[]): void => {

      for (const component of components) {
        if (!component.hidden) {
          /// Si tratta di un contenitore?
          if (Array.isArray(component.components) && component.components.length > 0) {
            getVisibleElements(component.components);
          }
          /// Si tratta di un layout a colonne?
          if (Array.isArray(component.columns) && component.columns.length > 0) {
            getVisibleElements(component.columns);
          }
          /// Si tratta di un Input?
          const inputTypes: string[] = [
            'autocomplete',
            'checkbox',
            'chips',
            'datetime',
            'email',
            'file',
            'htmlelement',
            'htmlbox',
            'jsonRule',
            'jsonRulesList',
            'map',
            'mapHtml',
            'multiLang',
            'number',
            'objectList',
            'objectList2',
            'objectListModuli',
            'parixgate',
            'password',
            'phoneNumber',
            'radio',
            'select',
            'selectboxes',
            'textarea',
            'textfield'
          ];
          if (inputTypes.includes(component.type)) {
            result.push(component.key);
          }
        }
      }
    };

    getVisibleElements(form.components);
    return result;
  }

  /**
   * Questo metodo recupera una porzione JSON che rappresenta un singolo campo in base a TYPE
   *
   * @param form IFormElement
   * @param type String
   */
  public getJsonElementByType(form: IFormElement, type: string): IFormElement {

    const getChildByType = (e: any, k: string): IFormElement | null => {
      let iterable: any[] = [];
      if (!!e.components && !!e.components.length) {
        iterable = e.components;
      }
      if (!!e.columns && !!e.columns.length) {
        iterable = e.columns;
      }
      for (const el of iterable) {
        if (el.type === k) {
          return el;
        } else if (el.components || el.columns) {
          const result = getChildByType(el, k);
          if (!this.isNullOrUndefined(result)) {
            return result;
          }
        }
      }
    };

    return getChildByType(form, type) as IFormElement;
  }

  public isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
    return typeof obj === 'undefined' || obj === null;
  }

  public isNull<T>(obj: T | null): obj is null {
    return obj === null;
  }

  public flattenObject(obj) {
    let count = 0;
    return Object.assign({}, ...function _flatten(o) {
      return [].concat(...Object.keys(o).map(k => typeof o[k] === 'object' ? _flatten(o[k]) : ({[k + '_' + (count++)]: o[k]})));
    }(obj));
  }

  public randomString(n: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
