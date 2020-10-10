import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mrf-tooltip-button',
  templateUrl: './tooltip-button.component.html',
  styleUrls: ['./tooltip-button.component.scss']
})
export class TooltipButtonComponent implements OnInit {
  @Input() field;
  @Input() readOnly: boolean;

  constructor() {}

  ngOnInit() {}
}
