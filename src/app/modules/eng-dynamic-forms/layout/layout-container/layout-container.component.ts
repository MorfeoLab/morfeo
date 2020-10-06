import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';

@Component({
  selector: 'mrf-layout-container',
  templateUrl: './layout-container.component.html',
  styleUrls: ['./layout-container.component.scss']
})
export class LayoutContainerComponent implements OnInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() externalData: {[key: string]: any};
  @Input() readOnly: boolean;

  constructor() { }

  ngOnInit() {}
}
