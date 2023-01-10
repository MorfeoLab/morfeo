import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxElementComponent } from './checkbox-element.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {HttpClient} from '@angular/common/http';
import {IFormElement} from '../../shared/models/form-element.model';
import {TEST_AUTOCOMPLETE_ELEMENT} from '../autocomplete-element/autocomplete-element.component.spec';
import {FormsModule, NgForm} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CheckboxElementComponent', () => {
    let component: CheckboxElementComponent;
    let fixture: ComponentFixture<CheckboxElementComponent>;

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
            declarations: [CheckboxElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CheckboxElementComponent);
        component = fixture.componentInstance;
        component.field = TEST_CHECKBOX_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_CHECKBOX_ELEMENT: IFormElement = {
    key: 'checkbox',
    type: 'checkbox',
    label: 'Casella di spunta',
    suffix: '',
    hidden: false,
    defaultValue: null,
    validate: {
        custom: ''
    },
    input: true,
    data: {}
};
