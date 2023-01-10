import {Injectable} from '@angular/core';
import {IFormAjaxResponse, IFormElement} from '../../models/form-element.model';
import {NgForm} from '@angular/forms';
import {UtilityService} from '../utility/utility.service';
import {HttpClient} from '@angular/common/http';
import {ButtonElementComponent} from '../../../form-element/button-element/button-element.component';

@Injectable({
    providedIn: 'root'
})
export class ButtonService {
    private callbackList: { [key: string]: () => void } = {};
    private responseList: { [id: string]: (res) => IFormAjaxResponse<any> } = {};


    constructor(
        private utility: UtilityService,
        private http: HttpClient
    ) {
    }

    public registerCallback(buttonName: string, callback: () => void): void {
        if (this.utility.isNullOrUndefined(this.callbackList)) {
            this.callbackList = {};
        }
        this.callbackList[buttonName] = callback;
    }

    public commonFunction(functionName: string, buttonElement: IFormElement, form: NgForm, component: ButtonElementComponent = null) {
        if (functionName === 'callback') {
            if (this.callbackList.hasOwnProperty(buttonElement.key + buttonElement.suffix)) {
                this.callbackList[buttonElement.key + buttonElement.suffix]();
            } else {
                console.warn(`No action registered for ${buttonElement.key + buttonElement.suffix} button`);
            }
        }
        if (functionName === 'copy') {
            switch (buttonElement.dataSrc) {
                case 'url':
                    if (component) {
                        component.isLoading = true;
                    }
                    this.loadFieldsValue(form, buttonElement, component);
                    break;
                default:
                    this.copyFieldsValue(form, buttonElement);
            }
        }
    }

    /**
     * Questa funziona carica dei valori esterni per poi applicarli a dei campi nel form
     * @param buttonElement
     * @param form
     * @private
     */
    private loadFieldsValue(form: NgForm, buttonElement: IFormElement, component: ButtonElementComponent = null): void {
        let url = buttonElement.data?.url;
        const method = buttonElement.data?.method || 'GET';
        const requestParams = {};
        if (!url) {
            console.error(`No url registered for ${buttonElement.key + buttonElement.suffix} button`);
            return;
        }
        if (buttonElement.data?.hasOwnProperty('params')) {
            for (const paramName in buttonElement.data.params) {
                if (buttonElement.data.params.hasOwnProperty(paramName)) {
                    const paramValue = buttonElement.data.params[paramName];
                    if (!paramValue) {
                        console.warn(`Button ${buttonElement.key} requires a value for ${paramName} property, ${paramValue} provided`);
                    }
                    if (paramName.charAt(0) === '$') {
                        url = url.split(paramName).join(String(paramValue));
                    } else {
                        requestParams[paramName] = paramValue;
                    }
                }
            }
        }
        if (buttonElement.data?.hasOwnProperty('configurableParams')) {
            for (const paramName in buttonElement.data.configurableParams) {
                if (buttonElement.data.configurableParams.hasOwnProperty(paramName)) {
                    const paramValue = form.controls[buttonElement.data.configurableParams[paramName]]?.value;
                    if (!paramValue) {
                        console.warn(`Button ${buttonElement.key} requires a value for ${paramName} property, ${paramValue} provided`);
                    }
                    if (paramName.charAt(0) === '$') {
                        url = url.split(paramName).join(String(paramValue));
                    } else {
                        requestParams[paramName] = paramValue;
                    }
                }
            }
        }
        this.http.request(method, url, {params: requestParams}).subscribe(
            res => {
                const responseHandlerCallback = this.getResponseHandler(buttonElement.key + buttonElement.suffix);
                let loadedValue = res;
                const value = {};
                if (!!responseHandlerCallback) {
                    loadedValue = responseHandlerCallback(res);
                }
                if (buttonElement.data?.hasOwnProperty('mapFieldToFormKey')) {
                    for (const propertyName in loadedValue) {
                        if (loadedValue.hasOwnProperty(propertyName)) {
                            if (buttonElement.data.mapFieldToFormKey.hasOwnProperty(propertyName)) {
                                value[buttonElement.data.mapFieldToFormKey[propertyName]] = loadedValue[propertyName];
                            }
                        }
                    }
                }
                form.setValue({...loadedValue, ...value});
            },
            () => {
                if (component) {
                    component.isLoading = false;
                }
            },
            () => {
                if (component) {
                    component.isLoading = false;
                }
            }
        );

    }

    /**
     * Questo metodo copia i valori attraverso i campi di uno stesso form
     * @param form
     * @param buttonElement
     * @private
     */
    private copyFieldsValue(form: NgForm, buttonElement: IFormElement) {
        const currentValue = form.value;
        const destValue = {};
        const fieldSuffix = buttonElement.suffix || '';
        if (buttonElement.content?.hasOwnProperty('copy')) {
            if (
                typeof buttonElement.content.copy === 'string' &&
                this.utility.isJSON(buttonElement.content.copy)
            ) {
                buttonElement.content.copy = JSON.parse(buttonElement.content.copy);
            }
            if (Array.isArray(buttonElement.content.copy)) {
                for (const copyField of (buttonElement.content.copy)) {
                    destValue[copyField.to + fieldSuffix] = currentValue[copyField.from + fieldSuffix];
                }
            }
        }
        form.setValue(destValue);
    }

    /**
     * Imposta una callback da richiamare per la gestione di una risposta HTTP
     */
    public setResponseHandler(id: string, callback: (res) => any) {
        this.responseList[id] = callback;
    }

    /**
     * Restituisce un riferimento alla callback registrata, se esiste
     */
    public getResponseHandler(key: string): (res) => any {
        if (this.responseList.hasOwnProperty(key)) {
            return this.responseList[key];
        }
        return (res) => res;
    }
}
