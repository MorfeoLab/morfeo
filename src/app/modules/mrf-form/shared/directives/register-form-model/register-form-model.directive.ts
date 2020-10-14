import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, NgForm, NgModel} from '@angular/forms';
import {RepeatableService} from '../../../layout/repeatable-container/repeatable.service';
import {UtilityService} from '../../services/utility/utility.service';

@Directive({
    selector: '[mrfRegisterForm]'
})
export class RegisterFormModelDirective implements OnInit, OnDestroy {

    @Input() public registerForm: NgForm;
    @Input() public registerModel: NgModel;

    constructor(
        private repeatableService: RepeatableService,
        private utils: UtilityService
    ) {
    }

    ngOnInit(): void {
        if (this.registerForm && this.registerModel) {
            this.overrideNgFormSetValue();
            this.registerForm.form.addControl(this.registerModel.name, this.registerModel.control);
            // this.registerForm.controls[this.registerModel.name].setValue('');
        }
    }

    ngOnDestroy(): void {
        // Non distruggere il form prima che sia stato inizializzato
        if (!this.registerForm || !this.registerModel) {
            return;
        }
        this.registerForm.removeControl(this.registerModel);
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
            const enabledValue = form.value;
            // Ripulisco i valori in ingresso da eventuali undefined
            Object.keys(value).forEach(key => {
                if (this.utils.isNullOrUndefined(value[key])) {
                    delete value[key];
                }
                if (currentValue.hasOwnProperty(key) && !enabledValue.hasOwnProperty(key)) {
                    // Questa chiave corrisponde a un controllo disabilitato, non dobbiamo cambiare valore
                    value[key] = currentValue[key];
                }
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
                    if (!!this.repeatableService.has(this.registerForm, key)) {
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
        this.registerForm.setValue = (value: IFormValue): void => {
            setValueLimited(this.registerForm, value);
        };
    }
}

interface IFormValue {
    [key: string]: any;
}
