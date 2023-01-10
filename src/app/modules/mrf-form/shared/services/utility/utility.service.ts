import {Injectable} from '@angular/core';
import {IForm, IFormColumn, IFormElement} from '../../models/form-element.model';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    constructor() {
    }

    public beep() {
        const sound = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
        sound.play().then();
    }

    /**
     * Questa funzione confronta due oggetti per determinare se sono equivalenti
     */
    public areObjectsEquivalent(a, b) {
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

    public areEquivalent(obj1: any, obj2: any, idProperty?: string): boolean {
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
        /// Regular Expression per identificare le stringhe contenenti regole JsonLogic
        const matcher = /[{\[]([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]/;
        // se è undefined ritorna false
        if (!item) {
            return false;
        }
        if (typeof item === 'string' && item.match(matcher)) {
            return true;
        }
        if (JSON.stringify(item).match(matcher)) {
            return true;
        }
        if (Array.isArray(item)) {
            return false;
        }

        // per retrocomptibilità con la precedente versione del metodo gli oggetti vengono considerati alla stregua dei JSON
        return typeof item === 'object';

    }


    /**
     * Questo metodo recupera una porzione JSON che rappresenta un singolo campo in base a KEY
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
                        'textfield',
                        'image',
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

    public isValidDate(d) {
        return d instanceof Date && !isNaN(d as unknown as number);
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

    public numericValue(n: any): number {
        let asString = String(n);
        if (isNaN(+asString)) {
            if (asString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
                asString = asString + ':00.000Z';
            }
            if (asString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
                /// La stringa è una data
                return (new Date(asString)).getTime();
            }
        }
        /// boolean -> NaN
        return parseFloat(asString);
    }

    public removeCircularReference(item: IFormElement): IFormElement {
        if (item.hasOwnProperty('parent')) {
            item.parent = null;
        }
        if (item.hasOwnProperty('components')) {
            item.components = (item.components.map((subItem: IFormElement) => {
                subItem.parent = null;
                this.removeCircularReference(subItem);
                return subItem;
            }) as unknown as IFormElement[]);
        }
        if (item.hasOwnProperty('columns')) {
            item.columns = (item.columns.map((subItem: IFormColumn) => {
                this.removeCircularReference(subItem as IFormElement);
                return subItem;
            }) as unknown as IFormColumn[]);
        }
        return item;
    }

    public lowerCaseIfString<T>(a: T): T {
        if (typeof a === 'string' && isNaN(Date.parse(a))) {
            return a.toLowerCase() as unknown as T;
        }
        return a;
    }
}
