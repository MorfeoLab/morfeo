import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateElementComponent } from './date-element.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('DateElementComponent', () => {
    let component: DateElementComponent;
    let fixture: ComponentFixture<DateElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                TranslatablePipe
            ],
            imports: [
                FormsModule,
                BrowserAnimationsModule,
                MaterialImportsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot()
            ],
            declarations: [DateElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DateElementComponent);
        component = fixture.componentInstance;
        component.field = TEST_DATE_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_DATE_ELEMENT: IFormElement = {
    key: 'date',
    label: 'Data',
    type: 'datetime',
    hidden: false,
    validate: {
        required: true,
        custom: ''
    },
    suffix: '',
    defaultValue: null,
    input: true,
    data: {}
};
