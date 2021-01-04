import { Component, Input, OnInit } from '@angular/core';
import {IFormElement} from '../../shared/models/form-element.model';

@Component({
  selector: 'mrf-tooltip-button',
  templateUrl: './tooltip-button.component.html',
  styleUrls: ['./tooltip-button.component.scss']
})
export class TooltipButtonComponent implements OnInit {
  @Input() field: IFormElement;
  @Input() readOnly: boolean;

  constructor() {}

  ngOnInit() {}
}
