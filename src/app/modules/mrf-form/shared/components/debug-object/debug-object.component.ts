import {Component, Input, isDevMode, OnInit} from '@angular/core';

@Component({
  selector: 'mrf-debug-object',
  templateUrl: './debug-object.component.html',
  styleUrls: ['./debug-object.component.scss']
})
export class DebugObjectComponent {
  @Input() istanza;
  @Input() prefix;

  constructor() {}

  public isDevMode = isDevMode;

  getDataString(): string {
    try {
      return (this.prefix || 'Object') + ': ' + JSON.stringify(this.istanza, null, '  ');
    } catch (e) {
      return e.message;
    }
  }

}
