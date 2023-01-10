import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyFileComponent } from './read-only-file.component';
import {TranslatablePipe} from '../../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../../shared/models/form-element.model';

describe('ReadOnlyFileComponent', () => {
    let component: ReadOnlyFileComponent;
    let fixture: ComponentFixture<ReadOnlyFileComponent>;

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
            declarations: [ReadOnlyFileComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReadOnlyFileComponent);
        component = fixture.componentInstance;
        component.field = TEST_READONLYFILE_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_READONLYFILE_ELEMENT: IFormElement = {
    type: 'file',
    label: '',
    key: '',
    readOnly: true
};
