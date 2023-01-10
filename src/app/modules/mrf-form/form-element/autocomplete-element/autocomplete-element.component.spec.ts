import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AutocompleteElementComponent} from './autocomplete-element.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {IFormElement} from '../../shared/models/form-element.model';
import {FormsModule, NgForm} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AutocompleteElementComponent', () => {
    let component: AutocompleteElementComponent;
    let fixture: ComponentFixture<AutocompleteElementComponent>;

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
            declarations: [AutocompleteElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AutocompleteElementComponent);
        component = fixture.componentInstance;
        component.field = TEST_AUTOCOMPLETE_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});


export const TEST_AUTOCOMPLETE_ELEMENT: IFormElement = {
    key: 'autocomplete',
    type: 'autocomplete',
    label: 'Completamento automatico',
    placeholder: 'Inserisci almeno due caratteri',
    dataSrc: 'values',
    data: {
        values: [
            {
                label: 'UNO',
                value: 'UNO'
            },
            {
                label: 'DUE',
                value: 'DUE'
            },
            {
                label: 'TRE',
                value: 'TRE'
            },
            {
                label: 'QUATTRO',
                value: 'QUATTRO'
            }
        ]
    },
    suffix: '',
    hidden: false,
    defaultValue: null,
    validate: {
        custom: ''
    },
    input: true,
    valueProperty: 'value',
    labelProperty: 'label'
};
