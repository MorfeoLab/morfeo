import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaElementComponent } from './text-area-element.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {SelectBoxesComponent} from '../select-boxes/select-boxes.component';
import {IFormElement} from '../../shared/models/form-element.model';

describe('TextAreaElementComponent', () => {
    let component: TextAreaElementComponent;
    let fixture: ComponentFixture<TextAreaElementComponent>;

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
            declarations: [TextAreaElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextAreaElementComponent);
        component = fixture.componentInstance;
        component.field = TEST_TEXTAREA_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_TEXTAREA_ELEMENT: IFormElement = {
    type: 'textarea',
    label: '',
    key: '',
    data: {}
};
