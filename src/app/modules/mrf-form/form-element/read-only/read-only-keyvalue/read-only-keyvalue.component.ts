import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {IFormElement} from '../../../shared/models/form-element.model';

@Component({
    selector: 'mrf-read-only-keyvalue',
    templateUrl: './read-only-keyvalue.component.html',
    styleUrls: ['./read-only-keyvalue.component.scss']
})
export class ReadOnlyKeyvalueComponent implements OnInit, AfterViewInit {

    @Input() field: IFormElement;
    @Input() formRef: NgForm;

    public JSON: any;
    public hiddenControl: FormControl;
    public htmlValue: any = '';

    constructor() {
        this.JSON = JSON;
    }

    ngOnInit() {
        this.field.suffix = this.field.suffix || '';
    }

    registerHiddenFieldListener() {
        if (!!this.hiddenControl) {
            this.hiddenControl.valueChanges.subscribe((v: any) => {
                if (v !== null && Array.isArray(v)) {
                    for (const value of v) {
                        this.htmlValue += value.label + ', ';
                    }
                    this.htmlValue = this.htmlValue.substring(0, this.htmlValue.length - 2);
                } else if (v !== null && v !== '') {
                    this.htmlValue = v.label;
                }
            });
        }
    }

    ngAfterViewInit(): void {

        this.hiddenControl = this.formRef.controls[
        this.field.key + this.field.suffix
            ] as FormControl;

        if (!!this.hiddenControl) {
            setTimeout(() => {
                this.hiddenControl.setValue(null);
            }, 0);
        }

        this.registerHiddenFieldListener();
    }
}
