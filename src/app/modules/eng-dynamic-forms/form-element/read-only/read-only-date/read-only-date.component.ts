import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {IFormElement} from '../../../shared/models/form-element.model';
import {FormControl, NgForm} from '@angular/forms';

@Component({
  selector: 'mrf-read-only-date',
  templateUrl: './read-only-date.component.html',
  styleUrls: ['./read-only-date.component.scss']
})
export class ReadOnlyDateComponent implements OnInit, AfterViewInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;

  public hiddenControl: FormControl;
  public htmlValue: any;


  constructor() { }

  ngOnInit() {
    this.field.suffix = this.field.suffix || '';
  }

  registerHiddenFieldListener() {
    this.hiddenControl.valueChanges.subscribe((v: any) => {
      if ( v !== null ) {
        this.htmlValue = v;
      }
    });
  }

  ngAfterViewInit(): void {
    this.hiddenControl = this.formRef.controls[
      this.field.key + this.field.suffix
      ] as FormControl;

    setTimeout(() => {
      this.hiddenControl.setValue(null);
    }, 0);

    this.registerHiddenFieldListener();
  }
}
