import {IFormAjaxResponse, IFormPageEventData, IFormTooltip} from '../../models/form-element.model';
import {MrfFormComponent} from '../../../mrf-form.component';
import {UtilityService} from '../utility/utility.service';
import {EventEmitter, Injectable} from '@angular/core';
import {DataTableComponent} from '../../../form-element/data-table/data-table.component';

@Injectable({
    providedIn: 'root'
})
export class DataTableService {
    private callbackList: any = {};
    private rendererList: any = {};
    private responseList: any = {};
    private sortingList: any = {};
    private filterMapperList: {[key: string]: (a: any) => any} = {};
    private paginatorCallbackList: any = {};
    private componentList: { [key: string]: DataTableComponent } = {};
    private tooltipList: { [key: string]: (row: any) => IFormTooltip } = {};
    private buttonVisibilityList: any = {};
    private searchFormRef: { [key: string]: MrfFormComponent } = {};

    private dataEmitter: {
        [key: string]: EventEmitter<any[] | IFormAjaxResponse<any>>
    };

    constructor(
        private utils: UtilityService
    ) {
    }

    /**
     * Imposta una callback da richiamare al click su un pulsante
     */
    public setCallback(path: string[], callback: (a) => void): void {
        this.callbackList[path.join('.')] = callback;
    }

    /**
     * Restituisce il riferimento alla callback registrata, se esiste
     */
    public getCallback(path: string[]): (a) => void {
        const callbackId = path.join('.');
        if (this.callbackList.hasOwnProperty(callbackId)) {
            return this.callbackList[callbackId];
        }
        return this.noOp;
    }

    /**
     * Imposta una callback da richiamare per rimappare i campi del filtro
     */
    public setFilterMapper(path: string, callback: (a: any) => any): void {
        this.filterMapperList[path] = callback;
    }

    /**
     * Restituisce il riferimento alla callback registrata, se esiste
     */
    public getFilterMapper(path: string): (a: any) => any {
        if (this.filterMapperList.hasOwnProperty(path)) {
            return this.filterMapperList[path];
        }
        return (a: any) => a;
    }

    /**
     * Imposta una callback da richiamare per il rendering del contentuo di una cella
     */
    public setRenderer(id: string, callback: (val, row?) => string | Promise<string>): void {
        this.rendererList[id] = callback;
    }

    /**
     * Restituisce un riferimento alla callback registrata, se esiste
     */
    public getRenderer(id: string): (val, row?) => string | Promise<{}> {
        if (this.rendererList.hasOwnProperty(id)) {
            return this.rendererList[id];
        }
        return (val) => val;
    }

    /**
     * Imposta una callback da richiamare per la gestione di una risposta HTTP
     */
    public setResponseHandler(id: string, callback: (res) => IFormAjaxResponse<any>) {
        this.responseList[id] = callback;
    }

    /**
     * Restituisce un riferimento alla callback registrata, se esiste
     */
    public getResponseHandler(key: string): (res) => IFormAjaxResponse<any> {
        if (this.responseList.hasOwnProperty(key)) {
            return this.responseList[key];
        }
        return (res) => res.body;
    }

    public setTooltipFactory(id: string, callback: (a) => IFormTooltip): void {
        this.tooltipList[id] = callback;
    }

    public getTooltipFactory(key: string) {
        if (this.tooltipList.hasOwnProperty(key)) {
            return this.tooltipList[key];
        }
        return () => ({text: ''});
    }

    /**
     * Genera la stringa con i parametri da inviare alla ricerca
     */
    public getRequestFilter(filterFields: any, mapper?: (a: any) => any): string {
        if (!!mapper) {
            filterFields = mapper(filterFields);
        }
        let response = '';
        for (const key in filterFields) {
            if (filterFields.hasOwnProperty(key)) {
                let value = filterFields[key];
                if (!this.utils.isNullOrUndefined(value)) {
                    /// Se il campo è null o non è definito non ha senso mandarlo al be
                    if (!['string', 'number', 'boolean'].includes(typeof value)) {
                        /// Un oggetto deve essere trasformato prima
                        if (!!value.toJSON) {
                            /// Se entra qui è stanza di Date o di Moment
                            value = value.toJSON();
                        } else {
                            value = JSON.stringify(value);
                        }
                    }
                    response = `${response}${key}=${value}&`;
                }
            }
        }
        return response.substring(0, response.length - 1);
    }

    public setFormRef(key: string, f: MrfFormComponent) {
        this.searchFormRef[key] = f;
    }

    public getFormRef(key: string): MrfFormComponent {
        return this.searchFormRef[key];
    }

    public setData<T>(key: string, values: T[] | IFormAjaxResponse<T>) {
        this.dataEmitter = this.dataEmitter || {};
        if (!this.dataEmitter[key]) {
            console.warn(`Impossibile assegnare dati alla tabella ${key} perché non esiste o ha una sorgente dati esterna.`);
            return;
        }
        this.dataEmitter[key].emit(values);
    }

    public getDataEmitter(key: string) {
        this.dataEmitter = this.dataEmitter || {};
        this.dataEmitter[key] = this.dataEmitter[key] || new EventEmitter<any[]>();
        return this.dataEmitter[key];
    }

    public setButtonVisibilityFunction(path: string[], callback: (row?: any, button?: any) => boolean): void {
        this.buttonVisibilityList[path.join('.')] = callback;
    }

    public getButtonVisibilityFunction(path: string[]): (row?: any, button?: any) => boolean {
        const callbackId = path.join('.');
        if (this.buttonVisibilityList.hasOwnProperty(callbackId)) {
            return this.buttonVisibilityList[callbackId];
        }
        return () => true;
    }

    public setSortingFunction(path: string[], callback: (item?: any[], property?: string) => any): void {
        this.sortingList[path.join('.')] = callback;
    }

    public getSortingFunction(path: string[]): (item: any[], property: string) => any {
        const callbackId = path.join('.');
        if (this.sortingList.hasOwnProperty(callbackId)) {
            return this.sortingList[callbackId];
        }
        return null;
    }

    public setPaginatorCallback(key: string, callback: (item?: IFormPageEventData) => void): void {
        this.paginatorCallbackList[key] = callback;
    }

    public getPaginatorCallback(key: string): (item?: any) => any {
        if (this.paginatorCallbackList.hasOwnProperty(key)) {
            return this.paginatorCallbackList[key];
        }
        return this.noOp;
    }

    public registerComponent(key: string, table: DataTableComponent): void {
        this.componentList[key] = table;
    }

    public getComponent(key: string): DataTableComponent | null {
        if (this.componentList.hasOwnProperty(key)) {
            return this.componentList[key];
        }
    }


    /**
     * Metodo vuoto, non esegue nessuna operazione, viene restituito come fallback in mancanza di funzioni registrate
     */
    public noOp() {
        console.log('DataTableService::noOp');
        return;
    }
}
