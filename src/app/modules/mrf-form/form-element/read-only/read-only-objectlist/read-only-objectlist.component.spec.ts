import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyObjectlistComponent } from './read-only-objectlist.component';
import {TranslatablePipe} from '../../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../../shared/models/form-element.model';
import {TEST_READONLYFILE_ELEMENT} from '../read-only-file/read-only-file.component.spec';

describe('ReadOnlyObjectlistComponent', () => {
    let component: ReadOnlyObjectlistComponent;
    let fixture: ComponentFixture<ReadOnlyObjectlistComponent>;

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
            declarations: [ReadOnlyObjectlistComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReadOnlyObjectlistComponent);
        component = fixture.componentInstance;
        component.field = TEST_READONLYOBJECTLIST_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_READONLYOBJECTLIST_ELEMENT: IFormElement = {
    type: 'objectList',
    label: '',
    key: '',
    readOnly: true
};
