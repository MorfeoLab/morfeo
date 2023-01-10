import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectListSelectorComponent } from './object-list-selector.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('ObjectListSelectorComponent', () => {
    let component: ObjectListSelectorComponent;
    let fixture: ComponentFixture<ObjectListSelectorComponent>;

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
            declarations: [ObjectListSelectorComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectListSelectorComponent);
        component = fixture.componentInstance;
        component.field = TEST_OBJECTLISTELECTOR_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});


export const TEST_OBJECTLISTELECTOR_ELEMENT: IFormElement = {
    type: 'objectList',
    label: '',
    key: '',
    columnsDefinition: []
};
