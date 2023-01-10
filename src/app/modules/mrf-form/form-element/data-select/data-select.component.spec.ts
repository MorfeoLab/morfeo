import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectComponent } from './data-select.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('DataSelectComponent', () => {
    let component: DataSelectComponent;
    let fixture: ComponentFixture<DataSelectComponent>;

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
            declarations: [DataSelectComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataSelectComponent);
        component = fixture.componentInstance;
        component.field = TEST_DATASELECT_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_DATASELECT_ELEMENT: IFormElement = {
    label: '',
    type: 'dataSelect',
    key: 'dataselect',
    data: {
        columns: []
    }
};
