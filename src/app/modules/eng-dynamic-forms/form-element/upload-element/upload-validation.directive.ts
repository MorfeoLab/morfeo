import {AfterViewInit, ChangeDetectorRef, Directive, forwardRef, Input, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, NgForm, NgModel, ValidationErrors, Validator, Validators} from '@angular/forms';
import {FileUploadModel, UploadElementComponent} from './upload-element.component';
import {IFormElement} from '../../shared/models/form-element.model';

@Directive({
  selector: '[mrfUploadValidation]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => UploadValidationDirective), multi: true}
  ]
})
export class UploadValidationDirective implements Validator,OnInit, AfterViewInit {
  @Input() component: UploadElementComponent;
  @Input() field: IFormElement = {type: 'file'};
  @Input('uploadRequired') private required = false;
  @Input() public registerForm: NgForm;
  @Input() public registerModel: NgModel;
  @Input() readOnly: boolean;
  @Input('uploadPattern') pattern: RegExp;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if(!!this.pattern){
      this.pattern = new RegExp(this.pattern);
    }else {
      this.pattern = new RegExp(/^[a-zA-Z0-9\-_\.]+\.(([Pp][Dd][Ff]\.[Pp]7[Mm])|([Pp][Dd][Ff])|([Xx][Mm][Ll])|([Dd][Ww][Ff]\.[Pp]7[Mm])|([Dd][Ww][Ff])|([Ss][Vv][Gg]\.[Pp]7[Mm])|([Ss][Vv][Gg])|([Jj][Pp][Gg]\.[Pp]7[Mm])|([Jj][Pp][Gg]))$/)
    }
  }

  ngAfterViewInit(): void {
    if (!this.registerForm || !this.registerModel) {
      return;
    }
    this.registerModel.control.valueChanges.subscribe(() => {
      this.registerModel.control.updateValueAndValidity({onlySelf: true, emitEvent: false});
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    /// Se il campo è nascosto il suo valore è null e non deve essere validato.
    if (this.field.hidden) {
      return null;
    }
    if (this.required && !this.field.disabled && this.component.files.length === 0) {
      return {uploadRequired: true};
    }
    if(this.component.files.length !== 0)
      for(const e of this.component.files){
        if (!e.data.name.match(this.pattern)){
          return {patternWrong: true};
        }
      }
    return null;
  }

}
