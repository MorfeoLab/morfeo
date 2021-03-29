import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';
import {DataService} from '../../shared/services/data-service/data-service.service';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';

@Component({
  selector: 'mrf-read-only',
  templateUrl: './read-only.component.html',
  styleUrls: ['./read-only.component.scss']
})
export class ReadOnlyComponent implements OnInit, AfterViewInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;

  public hiddenControl: FormControl;
  public htmlValue: any;
  private valueField = 'value';
  private labelField = 'label';

  constructor(private dataService: DataService,
              private translatable: TranslatablePipe) { }

  ngOnInit() {
    this.field.suffix = this.field.suffix || '';
    this.valueField = this.field.valueProperty || this.valueField;
    this.labelField = this.field.labelProperty || this.labelField;
    this.field.valueProperty = this.valueField;
    this.field.labelProperty = this.labelField;
  }

  registerHiddenFieldListener() {


    this.hiddenControl.valueChanges.subscribe((v: any) => {
      if ( !!v ) {
        if (!!this.field.dataSrc) {
          switch (this.field.dataSrc) {
            case 'url' :
              this.dataService
                .getResource(this.field.data.url + '/' + v)
                .subscribe((data) => {
                    this.htmlValue = this.translatable.transform(data[this.labelField]);
                });
              break;
            case 'values':
              const index = this.field.data.values.findIndex(p => p.value === v);
              this.htmlValue = this.field.data.values[index].label;
              break;
            default:
              console.warn(`[READONLY] ${this.field.key}: Unmanaged case ${this.field.dataSrc}`);
          }
        } else {
          this.htmlValue = v;
        }
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
