import {Component, Input, OnInit} from '@angular/core';
import {IFormElement, IFormElementValidationMessages} from '../../models/form-element.model';
import {AbstractControl, NgModel} from '@angular/forms';

@Component({
  selector: '[mrfErrorMessages]',
  templateUrl: './error-messages.component.html',
  styleUrls: ['./error-messages.component.scss']
})
export class ErrorMessagesComponent implements OnInit {
  @Input('me') public me: AbstractControl | NgModel;
  @Input('field') public field: IFormElement;

  public messages: IFormElementValidationMessages;

  constructor() { }

  ngOnInit(): void {
    this.messages = {
      custom: 'generic.labels.jsonValidationError',
      filePatternWrong: 'generic.labels.filePatternWrong',
      max: 'generic.labels.max',
      maxLength: 'generic.labels.maxLength',
      min: 'generic.labels.min',
      minLength: 'generic.labels.minLength',
      pattern: 'generic.labels.pattern',
      required: 'generic.labels.campoObbligatorio',
      uploadRequired: 'generic.labels.fileObbligatorio',
      ...this.field.validate?.messages
    };
  }

}
