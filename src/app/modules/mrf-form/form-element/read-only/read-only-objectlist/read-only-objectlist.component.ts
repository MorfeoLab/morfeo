import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {IFormElement} from '../../../shared/models/form-element.model';

@Component({
  selector: 'mrf-read-only-objectlist',
  templateUrl: './read-only-objectlist.component.html',
  styleUrls: ['./read-only-objectlist.component.scss']
})
export class ReadOnlyObjectlistComponent implements OnInit, AfterViewInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;

  public hiddenControl: FormControl;
  public htmlValue: any;

  constructor() { }

  ngOnInit() {
    this.field.suffix = this.field.suffix || '';
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

  decodeURI(s: string) {
    if(!s) {
      return '';
    }
    this.field.tag = this.field.tag || 'p';
    s = s.replace(/%(?![a-f0-9]{2})/gi, '%25');
    return '<' + this.field.tag + '>' + decodeURI(s) + '</' + this.field.tag + '>';
  }

  registerHiddenFieldListener() {
    this.hiddenControl.valueChanges.subscribe((v: any) => {
      if ( v !== null && v !== '' ) {
        this.htmlValue = v;
      }
    });
  }
}
