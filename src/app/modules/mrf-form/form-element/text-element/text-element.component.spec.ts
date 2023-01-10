import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextElementComponent } from './text-element.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('TextElementComponent', () => {
    let component: TextElementComponent;
    let fixture: ComponentFixture<TextElementComponent>;

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
            declarations: [TextElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextElementComponent);
        component = fixture.componentInstance;
        component.field = TEST_TEXTFIELD_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    /**
     * @TODO:
     * Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
     * Previous value: 'undefined'. Current value: ''.. Find more at https://angular.io/errors/NG0100
     */
    /*
        it('should create', () => {
            expect(component).toBeTruthy();
        });
      */
});

export const TEST_TEXTFIELD_ELEMENT: IFormElement = {
    type: 'textfield',
    label: '',
    key: '',
    data: {}
};
