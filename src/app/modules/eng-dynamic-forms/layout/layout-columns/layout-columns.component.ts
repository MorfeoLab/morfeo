import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';

@Component({
  selector: 'mrf-layout-columns',
  templateUrl: './layout-columns.component.html',
  styleUrls: ['./layout-columns.component.scss']
})
export class LayoutColumnsComponent implements OnInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() externalData: {[key: string]: any};
  @Input() readOnly: boolean;

  constructor() {
  }

  ngOnInit() {
    if (!this.field) {
      return;
    }

    for (const col of this.field.columns) {
      for (const component of col.components) {
        component.suffix = this.field.suffix;
      }
    }
  }
}
