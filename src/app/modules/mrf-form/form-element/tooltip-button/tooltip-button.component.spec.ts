import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TooltipButtonComponent} from './tooltip-button.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('TooltipButtonComponent', () => {
    let component: TooltipButtonComponent;
    let fixture: ComponentFixture<TooltipButtonComponent>;

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
            declarations: [TooltipButtonComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TooltipButtonComponent);
        component = fixture.componentInstance;
        component.field = TEST_TOOLTIPBUTTON_ELEMENT;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_TOOLTIPBUTTON_ELEMENT: IFormElement = {
    type: 'button',
    label: '',
    key: '',
    data: {}
};
