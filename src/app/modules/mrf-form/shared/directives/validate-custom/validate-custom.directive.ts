import {Directive, forwardRef, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {UtilityService} from '../../services/utility/utility.service';
import {CodiceFiscale} from '../../libraries/codice-fiscale/codice-fiscale';

/**
 * Direttiva di validazione per i campi che dipendono dal tipo TEXT
 * È stata introdotta per gestire MIN e MAX sui campi di tipo NUMBER
 * Potrebbe essere arricchita con i controlli specifici per EMAIL o altro
 */

@Directive({
    selector: '[mrfValidateCustom]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidateCustomDirective), multi: true}
    ]
})
export class ValidateCustomDirective implements Validator {
    @Input() min: number;
    @Input() max: number;
    @Input() type: string;
    @Input() validatePreset: 'codiceFiscale' | '';

    constructor(
        private utils: UtilityService
    ) {
    }

    validate(control: AbstractControl): ValidationErrors | null {
        if (this.type === 'number') {
            /**
             * Controlli per il tipo NUMBER
             */
            if (!this.utils.isNullOrUndefined(this.min)) {
                if (+this.min > +control.value) {
                    return {
                        min: this.min
                    };
                }
            }
            if (!this.utils.isNullOrUndefined(this.max)) {
                if (+this.max < +control.value) {
                    return {
                        max: this.max
                    };
                }
            }
        } else if (this.validatePreset === 'codiceFiscale') {
            console.log('meh');
            /**
             * Controlli per il tipo codiceFiscale
             */
            const error = CodiceFiscale.validate(control.value);
            if (!!error) {
                return {
                    validatePreset: `Codice fiscale: ${error}`
                };
            }
        }
        return null;
    }

}
