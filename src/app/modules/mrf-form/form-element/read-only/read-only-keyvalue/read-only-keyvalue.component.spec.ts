import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyKeyvalueComponent } from './read-only-keyvalue.component';
import {TranslatablePipe} from '../../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../../shared/models/form-element.model';
import {TEST_READONLYFILE_ELEMENT} from '../read-only-file/read-only-file.component.spec';

describe('ReadOnlyKeyvalueComponent', () => {
    let component: ReadOnlyKeyvalueComponent;
    let fixture: ComponentFixture<ReadOnlyKeyvalueComponent>;

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
            declarations: [ReadOnlyKeyvalueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReadOnlyKeyvalueComponent);
        component = fixture.componentInstance;
        component.field = TEST_READONLYFILE_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_READONLYKEYVALUE_ELEMENT: IFormElement = {
    type: 'map',
    label: '',
    key: '',
    readOnly: true
};
