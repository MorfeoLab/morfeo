import {AfterViewInit, Directive, forwardRef, Input} from '@angular/core';
import {UtilityService} from '../../services/utility/utility.service';
import {AbstractControl, NG_VALIDATORS, NgForm, NgModel, ValidationErrors, Validator} from '@angular/forms';
import {ConditionalService, SCOPED_SUFFIX} from '../../services/conditional/conditional.service';
import {ExternalDataService} from '../../services/external-data.service';
import {JsonLogicNode} from '../../../form-element/json-rule-element/json-rule-element.component';
import {Moment} from 'moment';

@Directive({
    selector: '[mrfValidateJsonRule]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ValidateJsonRuleDirective),
            multi: true
        }
    ]
})
export class ValidateJsonRuleDirective implements Validator, AfterViewInit {
    @Input() public jsonRule: string | JsonLogicNode[];
    @Input() public registerForm: NgForm;
    @Input() public registerModel: NgModel;
    @Input() public name: string;
    private externalData: { [key: string]: any };
    private validRule: boolean;

    constructor(
        private utility: UtilityService,
        private conditionalService: ConditionalService,
        private externalDataService: ExternalDataService
    ) {
        this.externalDataService.externalData.subscribe(v => {
            this.externalData = v;
        });
    }

    ngAfterViewInit(): void {
        if (!this.registerForm || !this.registerModel) {
            return;
        }
        /// @TODO: Occorre fare un unico subscribe globale per questa cosa
        this.registerForm.valueChanges.subscribe(() => {
            this.registerModel.control.updateValueAndValidity({onlySelf: false, emitEvent: false});
        });
        if (!!this.jsonRule) {
            this.validRule = !this.utility.isNullOrUndefined(this.jsonRule) && this.utility.isJSON(this.jsonRule);
        }
    }

    validate(control: AbstractControl): ValidationErrors | null {
        if (
            !this.utility.isNullOrUndefined(this.registerForm) &&
            this.validRule &&
            this.registerForm.dirty &&
            (this.registerModel.touched || this.registerModel.dirty)
        ) {
            if (typeof this.jsonRule === 'string') {
                this.jsonRule = JSON.parse(this.jsonRule);
            }

            const formValue = JSON.parse(JSON.stringify(this.registerForm.value));
            let externalData = this.externalData;
            const lowerCaseValues = {};

            if (!!this.externalData) {
                externalData = JSON.parse(JSON.stringify(this.externalData));
                for (const key in externalData) {
                    if (externalData.hasOwnProperty(key)) {
                        lowerCaseValues[key] = typeof externalData[key] === 'string' ? String(externalData[key]) : externalData[key];
                    }
                }
            }
            for (const key in formValue) {
                if (formValue.hasOwnProperty(key)) {
                    lowerCaseValues[key] = typeof formValue[key] === 'string' ? String(formValue[key]) : formValue[key];
                }
            }
            /**
             * In presenza dei ripetibili occorre sostituire il suffisso ':++' con il suffisso del campo corrente
             */
            const suffix = this.name.substring(this.name.indexOf(':'));
            if (typeof this.jsonRule !== 'string') {
                this.jsonRule = JSON.stringify(this.jsonRule);
            }
            const scopedRule = JSON.parse(this.jsonRule.split(SCOPED_SUFFIX).join(suffix));
            const isValid = this.conditionalService.jsonLogic.apply(scopedRule, lowerCaseValues);
            for (const valid of isValid) {
                if (!valid) {
                    return {
                        validateJsonRule: this.jsonRule
                    };
                }
            }
        }
        return null;
    }

}
