import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {IFormButton} from '../../models/form-element.model';

@Component({
  selector: 'mrf-generic-button',
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss']
})
export class GenericButtonComponent implements OnInit {
  @ViewChild('componentPlaceholder', {
    static: true,
    read: ViewContainerRef
  }) public componentPlaceholder: ViewContainerRef;
  @Input('button') public button: IFormButton;
  @Output() click = new EventEmitter();

  constructor() {
  }

  public clicked($event) {
    this.click.emit($event);
    $event.stopPropagation();
  }

  ngOnInit(): void {
  }

}
