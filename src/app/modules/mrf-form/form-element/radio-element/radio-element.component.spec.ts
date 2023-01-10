import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RadioElementComponent} from './radio-element.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('RadioElementComponent', () => {
    let component: RadioElementComponent;
    let fixture: ComponentFixture<RadioElementComponent>;

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
            declarations: [RadioElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RadioElementComponent);
        component = fixture.componentInstance;
        component.field = TEST_RADIO_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_RADIO_ELEMENT: IFormElement = {
    type: 'radio',
    label: '',
    key: ''
};
