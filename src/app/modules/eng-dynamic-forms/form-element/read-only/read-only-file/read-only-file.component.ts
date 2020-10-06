import {Component, Input, OnInit} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {IFormElement} from '../../../shared/models/form-element.model';

@Component({
  selector: 'mrf-read-only-file',
  templateUrl: './read-only-file.component.html',
  styleUrls: ['./read-only-file.component.scss']
})
export class ReadOnlyFileComponent implements OnInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;

  public hiddenControl: FormControl;
  public htmlValue: any;

  constructor() { }

  ngOnInit() {
  }

}
