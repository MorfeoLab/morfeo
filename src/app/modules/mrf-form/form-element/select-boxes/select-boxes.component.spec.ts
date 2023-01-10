import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBoxesComponent } from './select-boxes.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('SelectBoxesComponent', () => {
    let component: SelectBoxesComponent;
    let fixture: ComponentFixture<SelectBoxesComponent>;

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
            declarations: [SelectBoxesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectBoxesComponent);
        component = fixture.componentInstance;
        component.field = TEST_SELECTBOXES_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_SELECTBOXES_ELEMENT: IFormElement = {
    type: 'selectboxes',
    label: '',
    key: '',
    data: {}
};
