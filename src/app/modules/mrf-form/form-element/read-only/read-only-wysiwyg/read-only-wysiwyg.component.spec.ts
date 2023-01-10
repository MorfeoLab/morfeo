import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyWysiwygComponent } from './read-only-wysiwyg.component';
import {TranslatablePipe} from '../../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../../shared/models/form-element.model';
import {TEST_READONLYOBJECTLIST_ELEMENT} from '../read-only-objectlist/read-only-objectlist.component.spec';

describe('ReadOnlyWysiwygComponent', () => {
    let component: ReadOnlyWysiwygComponent;
    let fixture: ComponentFixture<ReadOnlyWysiwygComponent>;

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
            declarations: [ReadOnlyWysiwygComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReadOnlyWysiwygComponent);
        component = fixture.componentInstance;
        component.field = TEST_READONLYOBJECTLIST_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_READONLYWYSIWYG_ELEMENT: IFormElement = {
    type: 'htmlelement',
    label: '',
    key: '',
    readOnly: true
};
