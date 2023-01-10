import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectListComponent } from './object-list.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('ObjectListComponent', () => {
    let component: ObjectListComponent;
    let fixture: ComponentFixture<ObjectListComponent>;

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
            declarations: [ObjectListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectListComponent);
        component = fixture.componentInstance;
        component.field = TEST_OBJECTLIST_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_OBJECTLIST_ELEMENT: IFormElement = {
    type: 'objectList',
    key: '',
    label: ''
};

