import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChipsElementComponent} from './chips-element.component';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ChipsElementComponent', () => {
    let component: ChipsElementComponent;
    let fixture: ComponentFixture<ChipsElementComponent>;

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
            declarations: [ChipsElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChipsElementComponent);
        component = fixture.componentInstance;
        component.field = TEST_CHIPS_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});


export const TEST_CHIPS_ELEMENT: IFormElement =  {
    label: 'Chips',
    key: 'chips',
    tooltip: {
        text: 'Inserisci le chips'
    },
    placeholder: 'Inserisci le chips',
    type: 'chips',
    input: true,
    hidden: false,
    data: {
        valueType: 'object',
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
    validate: {
        required: false,
        custom: ''
    },
    suffix: '',
    defaultValue: null
};
