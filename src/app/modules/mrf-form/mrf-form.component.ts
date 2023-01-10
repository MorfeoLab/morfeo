import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {AbstractControl, NgForm} from '@angular/forms';
import {IForm, IFormElement, IFormOptions} from './shared/models/form-element.model';
import {TabsService} from './shared/services/tabs/tabs.service';
import {ConditionalService} from './shared/services/conditional/conditional.service';
import {DataService} from './shared/services/data/data.service';
import {ComboService} from './shared/services/combo/combo.service';
import {Subscription} from 'rxjs';
import {UtilityService} from './shared/services/utility/utility.service';
import {UploaderService} from './shared/services/uploader.service';
import {ResetOnChangeService} from './shared/services/reset-on-change.service';
import {MatSelect} from '@angular/material/select';
import {ValueService} from './shared/services/value/value.service';
import {ExternalDataService} from './shared/services/external-data.service';
import {RepeatableService} from './layout/repeatable-container/repeatable.service';

@Component({
    selector: 'mrf-form',
    templateUrl: './mrf-form.component.html',
    styleUrls: ['./mrf-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MrfFormComponent implements OnDestroy, OnInit {

    private logEnabled = false;
    /**
     * La definizione JSON del form da costruire
     */
    private formJson: IForm;

    /**
     * Un flag booleano che stabilisce se possiamo emettere l'evento
     */
    private shouldEmitReadyEvent = true;

    // noinspection JSMismatchedCollectionQueryUpdate
    /**
     * Un elenco di id di combo che sono in attesa di caricare le loro opzioni
     */
    private comboLoadingList: string[] = [];

    /**
     * Sottoscrizione agli eventi di upload
     */
    private uploadServiceSubscription: Subscription;

    /**
     * Dati esterni da considerare per le regole
     */
    @Input() public externalData: { [key: string]: any } = {};
    /**
     * La configurazione JSON per il form
     */
    @Input() public config: FormContainerConfig = {};

    /**
     * Riferimento al form generato
     */
    @ViewChild('f') public f: NgForm;

    /**
     * Evento scatenato nel momento in cui il form sarà disponibile
     */
    public formReadyEvent = new EventEmitter<NgForm>();

    /**
     * Bisogna cancellare la sottoscrizione quando andiamo via
     */
    private comboWithRemoteOptionsChangeSubscription: Subscription;

    /**
     * Esegue la callback assegnata a un pulsante generico
     */
    buttonCallback(button: ButtonConfig) {
        button.callback();
    }

    constructor(
        private data: DataService,
        private conditionalService: ConditionalService,
        private tabsService: TabsService,
        public comboService: ComboService,
        private utils: UtilityService,
        private uploadService: UploaderService,
        private renderer: Renderer2,
        private resetOnChangeService: ResetOnChangeService,
        public valueService: ValueService,
        private externalDataService: ExternalDataService,
        private repeatableService: RepeatableService
    ) {
        tabsService.$eventHandler.subscribe(event => {
            if (event.callback === 'nextTab') {
                tabsService.openNextTab(this.form);
            }
        });
    }

    @Input()
    public set form(f: IForm) {
        if (!this.formJson || !this.utils.areObjectsEquivalent(this.formJson, f)) {
            /**
             * Assegnando null il componente scompare dalla pagina
             * In questo modo viene ricostruito dal codice dentro
             * setTimeout e tutte le funzionalità si inizializzano
             * correttamente
             */
            this.formJson = null;
            setTimeout(() => {
                /// Purge references for old form
                this.conditionalService.purgeRules();
                this.shouldEmitReadyEvent = true;
                if (!!this.comboWithRemoteOptionsChangeSubscription) {
                    this.comboWithRemoteOptionsChangeSubscription.unsubscribe();
                    this.comboWithRemoteOptionsChangeSubscription = null;
                }
                this.formJson = f;
                this.conditionalService.avoidLowerCase = !!this.formJson.avoidLowerCase;
                this.valueService.loadForm(this.formJson);
                this.tryToEmitReadyEvent();
            }, 0);
        }
    }

    public get form(): IForm {
        return this.formJson;
    }

    ngOnDestroy(): void {
        /**
         * Cancello l'iscrizione agli eventi di comboWithRemoteOptions
         */
        if (!!this.comboWithRemoteOptionsChangeSubscription) {
            this.comboWithRemoteOptionsChangeSubscription.unsubscribe();
            this.comboWithRemoteOptionsChangeSubscription = null;
        }
    }

    ngOnInit(): void {
        /**
         * Sottoscrizione a formnReady per registrare il listener su conditional
         */
        this.formReadyEvent.subscribe((f) => {
            /**
             * Sottoscrizione ai cambiamenti delle opzioni nelle combo con sorgenti dati remote
             */
            this.comboWithRemoteOptionsChangeSubscription = this.comboService.comboWithRemoteOptionsChange.subscribe(list => {
                this.comboLoadingList = list;
                this.tryToEmitReadyEvent();
            });

            this.conditionalService.registerForm(f, this.externalData);
            this.externalDataService.externalData.emit(this.externalData);
            this.resetOnChangeService.registerForm(f);
            this.overrideNgFormSetValue();
        });
    }

    /**
     * Esegue la callback assegnata al pulsante reset
     */
    resetForm() {
        this.f.reset({});
        if (!!this.config.resetCallback) {
            this.config.resetCallback(this.f);
        }
    }

    /**
     * Imposta un elenco di opzioni che saranno utilizzati dall'autocomplete
     * all'interno del componente
     */
    public setListaAutocompleteObjList(e: IFormOptions[]) {
        this.data.changeMessage(e);
    }

    /**
     * Esegue la callback assegnata al pulsante submit
     */
    submitForm($event) {
        if (!!this.uploadServiceSubscription) {
            $event.preventDefault();
            /// Sono in attesa che si completino i downloads
            return;
        }
        if (this.f.valid) {
            this.uploadFiles(() => {
                if (!!this.config.submitCallback) {
                    this.config.submitCallback(this.f);
                }
            });
        }
    }

    overrideNgFormSetValue() {
        const setValueLimited = (form: NgForm, value: IFormValue) => {
            /**
             * Recupero tutte le chiavi del form
             * è importante usare control.getRawValue() perché altrimenti non avremo le chiavi
             * per i campi disabilitati e questo poi porterà a un errore più avanti con setValue
             * e un insieme incompleto di campi.
             * Il problema è che getValue restituisce solo i campi abilitati mentre setValue li vuole tutti.
             */
            const currentValue = form.control.getRawValue();
            // Ripulisco i valori in ingresso da eventuali undefined
            Object.keys(value).forEach(key => {
                if (this.utils.isNullOrUndefined(value[key])) {
                    delete value[key];
                }
                /**
                 * Questo controllo fa in modo che se un campo è disabilitato ma valorizzato allora
                 * non è preso in considerazione, ma sembra un errore perché in questo modo funziona
                 * solo la prima volta che si invoca setValue e non funziona le successive.
                 * 24/09/2021 lo rimuovo.
                 */
                // if (currentValue.hasOwnProperty(key) && !enabledValue.hasOwnProperty(key) && !this.utils.isNullOrUndefined(currentValue[key])) {
                //     // Questa chiave corrisponde a un controllo disabilitato, non dobbiamo cambiare valore
                //     value[key] = currentValue[key];
                // }
            });
            // Unisco i valori correnti con i valori in ingresso
            value = {...currentValue, ...value};
            // Recupero tutte le chiavi che si intende modificare
            const keys = Object.keys(value);
            // Ciclo tutte le chiavi cercando corrispondenza nel form
            for (const key of keys) {
                const currentControl: AbstractControl = form.controls[key];
                if (!currentControl) {
                    /// La chiave non è presente nel form, provo a chiedere ai ripetibili
                    if (!!this.repeatableService.has(this.f, key)) {
                        /**
                         * Questa chiave si trova all'intero di un blocco ripetibile, dobbiamo
                         * aspettare il tempo necessario perché le righe vuote vengano create.
                         */
                        setTimeout(() => {
                            setValueLimited(form, value);
                        }, 0);
                        return;
                    }
                }
            }
            /**
             * A questo punto dovreei avere un elenco completo di campi che posso usare per il setvalue
             */
            form.control.patchValue(value);
        };
        this.f.form.setValue = (value: IFormValue): void => {
            setValueLimited(this.f, value);
        };
        this.f.setValue = this.f.form.setValue;
    }

    public setValue(value: IFormValue): void {
        this.f.setValue(value);
    }

    /**
     * Se è tutto a posto emette l'evento, altrimenti richiama se stessa dopo un po'
     */
    private tryToEmitReadyEvent() {
        if (this.shouldEmitReadyEvent) {
            if (this.comboLoadingList.length === 0 && !!this.f) {
                this.formReadyEvent.emit(this.f);
                this.shouldEmitReadyEvent = false;
            } else {
                setTimeout(() => {
                    this.tryToEmitReadyEvent();
                }, 100);
            }
        }
    }

    public uploadFiles(callback) {
        /// Se esiste una precedente sottoscrizione la cancelliamo
        if (!!this.uploadServiceSubscription) {
            this.uploadServiceSubscription.unsubscribe();
            this.uploadServiceSubscription = null;
        }
        /// Non tutti i file sono al 100%, quindi non abbiamo ancora finito, nuova sottoscrizione
        if (!this.uploadService.ready) {
            this.uploadServiceSubscription = this.uploadService.uploadElementEvent.subscribe(() => {
                this.uploadFiles(callback);
            });
            this.uploadService.uploadAll();
        } else {
            callback();
        }
    }

    /**
     * Imposta il focus su un campo del form
     */
    public setFocus(name: string) {
        const log = (msg: string) => {
            if (this.logEnabled) {
                console.log(`%c[setFocus error] ${msg}`, 'background: red; color: white');
            }
        };
        const elementJson: IFormElement = this.utils.getJsonElementByKey(this.form, name);
        if (!elementJson) {
            log(`element ${name} not found in form`);
            return;
        }
        let focusElement: any;
        try {
            focusElement = this.renderer.selectRootElement(`[ng-reflect-name="${name}"]`, true);
        } catch (e) {
            log(`%cFocus element not found [${name}]`);
            return;
        }
        switch (elementJson.type) {
            case 'button':
            case 'email':
            case 'datetime':
            case 'number':
            case 'password':
            case 'phoneNumber':
            case 'textarea':
            case 'textfield':
            case 'image':
                if (!!focusElement) {
                    focusElement.focus();
                }
                break;
            case 'autocomplete':
                if (!!focusElement) {
                    focusElement.click();
                }
                break;
            case 'select':
                (focusElement as MatSelect).focus();
                break;
            case 'checkbox':
                (document.querySelector(`[id^="${name}-"]`) as HTMLInputElement).focus();
                focusElement.classList.add('cdk-focused');
                focusElement.classList.add('cdk-keyboard-focused');
                break;
            case 'selectboxes':
                focusElement = (document.querySelector(`.mrf-selectboxes-${name}`) as HTMLInputElement);
                (document.querySelector(`.mrf-selectboxes-${name} input`) as HTMLInputElement).focus();
                focusElement.classList.add('cdk-focused');
                focusElement.classList.add('cdk-keyboard-focused');
                break;
            case 'objectList':
            case 'objectList2':
                (document.querySelector(`#mrf-objectlist-${name}`) as HTMLButtonElement).click();
                break;
            case 'chips':
                (document.querySelector(`.mrf-chips-${name}`) as HTMLInputElement).click();
                break;
            case 'file':
                (document.querySelector(`.mrf-upload-${name}`) as HTMLButtonElement).click();
                break;
            case 'map':
                (document.querySelector(`.mrf-map-${name}`) as HTMLButtonElement).click();
                break;
            case 'radio':
                focusElement = document.querySelector(`.mrf-radio-${name}`);
                focusElement.focus();
                focusElement.classList.add('cdk-focused');
                focusElement.classList.add('cdk-keyboard-focused');
                break;
            default:
                break;
        }
    }

    public get value(): any {
        const visibleElements: string[] = this.utils.getVisibleElementsList(this.form);
        const value: { [key: string]: any } = {};
        if (!!this.f) {
            const currentFormValue = this.f.control.getRawValue();
            for (const key in currentFormValue) {
                if (currentFormValue.hasOwnProperty(key)) {
                    if (!this.utils.isNullOrUndefined(currentFormValue[key])) {
                        if (visibleElements.includes(key.split(':')[0])) {
                            value[key] = currentFormValue[key];
                        }
                    }
                }
            }
        }
        return value;
    }
}

export interface FormContainerConfig {
    showSubmit?: boolean;
    submitLabel?: string;
    submitIcon?: string;
    submitCallback?: (f: NgForm) => void;

    showReset?: boolean;
    resetLabel?: string;
    resetIcon?: string;
    resetCallback?: (f: NgForm) => void;

    buttons?: ButtonConfig[];
}

export interface ButtonConfig {
    label?: string;
    icon?: string;
    callback?: () => void;
}

interface IFormValue {
    [key: string]: any;
}


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-eng-dynamic-forms',
    templateUrl: './mrf-form.component.html',
    styleUrls: ['./mrf-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EngDynamicFormsComponent extends MrfFormComponent {
}
