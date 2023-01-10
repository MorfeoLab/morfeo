import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyDateComponent } from './read-only-date.component';
import {TranslatablePipe} from '../../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../../shared/models/form-element.model';

describe('ReadOnlyDateComponent', () => {
    let component: ReadOnlyDateComponent;
    let fixture: ComponentFixture<ReadOnlyDateComponent>;

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
            declarations: [ReadOnlyDateComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReadOnlyDateComponent);
        component = fixture.componentInstance;
        component.field = TEST_READONLYDATE_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_READONLYDATE_ELEMENT: IFormElement = {
    type: 'datetime',
    label: '',
    key: '',
    readOnly: true
};
