import { Component, Input, OnInit } from '@angular/core';
import { ButtonService } from '../../shared/services/button-service/button-service.service';
import { NgForm } from '@angular/forms';
import { IFormElement } from '../../shared/models/form-element.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';

@Component({
  selector: 'mrf-button-element',
  templateUrl: './button-element.component.html',
  styleUrls: ['./button-element.component.scss']
})
export class ButtonElementComponent implements OnInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() readOnly: boolean;

  constructor(
    public buttonService: ButtonService,
    private translatable: TranslatablePipe
  ) {}

  ngOnInit() {
    this.field.suffix = this.field.suffix || '';
  }

  execute() {
    this.buttonService.commonFunction(this.field.action, this.field, this.formRef);
  }

  public displayLabel(): string {
    if (!!this.field.hideLabel) {
      /// Non ha senso un pulsante senza testo, non sarebbe cliccabile
      return '#';
    } else {
      return this.translatable.transform(this.field.label);
    }
  }
}
