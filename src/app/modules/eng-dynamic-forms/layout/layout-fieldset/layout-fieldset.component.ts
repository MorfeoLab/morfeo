import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';

@Component({
  selector: 'mrf-layout-fieldset',
  templateUrl: './layout-fieldset.component.html',
  styleUrls: ['./layout-fieldset.component.scss']
})
export class LayoutFieldsetComponent implements OnInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() externalData: {[key: string]: any};
  @Input() readOnly: boolean;

  constructor() { }

  ngOnInit() {
    if (!this.field) {
      return;
    }
    this.field.components = this.field.components || [];
    for (const component of this.field.components) {
      component.suffix = this.field.suffix;
    }
  }
}
