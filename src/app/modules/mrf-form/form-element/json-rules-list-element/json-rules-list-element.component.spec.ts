import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JsonRulesListElementComponent} from './json-rules-list-element.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('JsonRulesListElementComponent', () => {
    let component: JsonRulesListElementComponent;
    let fixture: ComponentFixture<JsonRulesListElementComponent>;

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
            declarations: [JsonRulesListElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JsonRulesListElementComponent);
        component = fixture.componentInstance;
        component.field = TEST_JSONRULES_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_JSONRULES_ELEMENT: IFormElement = {
    key: '',
    label: '',
    type: 'jsonRulesList'
};
