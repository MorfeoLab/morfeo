import {EventEmitter, Injectable} from '@angular/core';
import {RepeatableContainerComponent} from './repeatable-container.component';
import {NgForm} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class RepeatableService {
    private repeatables: RepeatableElements[] = [];
    private deletingEventEmitter: { [key: string]: EventEmitter<string> } = {};

    constructor() {
    }

    /**
     * Aggiunge un componente ripetibile all'elenco
     * Utilizzato da RepeatableContainer
     * @param key: L'id del campo che deve essere aggiutno
     * @param component: Riferimento al componente che deve essere registrato
     */
    public add(key: string, component): void {
        const formList: RepeatableElements = this.getList(component.formRef);
        if (!formList.repeatableList.hasOwnProperty(key)) {
            formList.repeatableList[key] = component;
        } else {
            console.warn(`Duplicate repeatable id: ${key}`);
        }
    }

    /**
     * Restituisce true se l'id è già registrato
     * Utilizzato da RegisterFormModelDirective
     * @param key: string L'id del campo
     */
    public has(form: NgForm, key: string): boolean {
        const formList: RepeatableElements = this.getList(form);
        const s: string = key.substr(0, key.lastIndexOf(':'));
        const n: number = +(key.substr(key.lastIndexOf(':') + 1));
        if (!formList.repeatableList.hasOwnProperty(s)) {
            return false;
        }
        formList.repeatableList[s].addElement(n);
        return true;
    }

    /**
     * Elimina l'elemento ripetibile dall'elenco in base all'id
     * Utilizzato da RepeatableContainer
     * @param key: string L'id del campo
     */
    public reset(form: NgForm, key: string): void {
        const formList: RepeatableElements = this.getList(form);
        delete formList.repeatableList[key];
    }

    /**
     * Restituisce l'elenco dei ripetibili registrati su un particolare form
     * Se non trova questo elenco crea un elenco vuoto e lo restituisce
     * @param form: NgForm Il form su cui si trovano gli elementi ripetibili
     */
    public getList(form: NgForm): RepeatableElements {
        for (const list of this.repeatables) {
            if (list.form === form) {
                return list;
            }
        }
        const newList = {
            form,
            repeatableList: []
        };
        this.repeatables.push(newList);
        return newList;
    }

    public registerForDeletingFile(key: string): EventEmitter<string> {
        if (!!this.deletingEventEmitter[key]) {
            return this.deletingEventEmitter[key];
        }
        const eventEmitter = new EventEmitter();
        this.deletingEventEmitter[key] = eventEmitter;
        return eventEmitter;
    }

    public emitDeletingEvent(key: string) {
        if (!!this.deletingEventEmitter[key]) {
            this.deletingEventEmitter[key].next('');
        }
    }
}

interface RepeatableElements {
    form: NgForm;
    repeatableList: {
        [key: string]: RepeatableContainerComponent
    }[];
}
