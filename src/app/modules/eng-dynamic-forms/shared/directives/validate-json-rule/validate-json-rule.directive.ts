import {AfterViewInit, ChangeDetectorRef, Directive, forwardRef, Input} from '@angular/core';
import {UtilityService} from '../../services/utility/utility.service';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NgForm,
  NgModel,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {ConditionalService} from '../../services/conditional/conditional.service';
import {ExternalDataService} from '../../services/external-data.service';
import {MatCheckbox} from '@angular/material/checkbox';


@Directive({
  selector: '[mrfValidateJsonRule]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidateJsonRuleDirective), multi: true}
  ]
})
export class ValidateJsonRuleDirective implements Validator, AfterViewInit {
  @Input() public jsonRule: string;
  @Input() public registerForm: NgForm;
  @Input() public registerModel: NgModel;
  private externalData: { [key: string]: any };
  private validRule: boolean;

  constructor(
    private utility: UtilityService,
    private changeDetect: ChangeDetectorRef,
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
    this.registerForm.valueChanges.subscribe(() => {
      this.registerModel.control.updateValueAndValidity({onlySelf: true, emitEvent: false});
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
      const jsonRule = JSON.parse(this.jsonRule.split('.').join('#'));

      const formValue = JSON.parse(JSON.stringify(this.registerForm.value).split('.').join('#'));
      let externalData = this.externalData;
      const lowerCaseValues = {};

      if (!!this.externalData) {
        externalData = JSON.parse(JSON.stringify(this.externalData).split('.').join('#'));
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
      const isValid = this.conditionalService.jsonLogic.apply(jsonRule, lowerCaseValues);
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

  getControlName(c: AbstractControl): string | null {
    const formGroup = c.parent.controls;
    return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
  }

}
