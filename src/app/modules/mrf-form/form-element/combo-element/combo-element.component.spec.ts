import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboElementComponent } from './combo-element.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('ComboElementComponent', () => {
    let component: ComboElementComponent;
    let fixture: ComponentFixture<ComboElementComponent>;

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
            declarations: [ComboElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComboElementComponent);
        component = fixture.componentInstance;
        component.field = TEST_SELECT_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_SELECT_ELEMENT: IFormElement = {
    label: 'Select example',
    key: 'type',
    type: 'select',
    validate: {
        required: true,
        custom: ''
    },
    defaultValue: null,
    hidden: false,
    data: {
        values: [
            {
                label: 'Opzione 1',
                value: '001'
            },
            {
                label: 'Opzione 2',
                value: '002'
            },
            {
                label: 'Opzione 3',
                value: '003'
            }
        ]
    },
    dataSrc: 'values',
    suffix: '',
    input: true,
    valueProperty: 'value',
    labelProperty: 'label'
};
