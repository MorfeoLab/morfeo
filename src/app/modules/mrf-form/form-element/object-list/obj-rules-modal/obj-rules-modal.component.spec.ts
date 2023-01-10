import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjRulesModalComponent} from './obj-rules-modal.component';
import {TranslatablePipe} from '../../../shared/pipes/translatable/translatable.pipe';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IFormElement} from '../../../shared/models/form-element.model';

describe('ObjRulesModalComponent', () => {
    let component: ObjRulesModalComponent;
    let fixture: ComponentFixture<ObjRulesModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                TranslatablePipe,
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}
                },
                {
                    provide: MatDialogRef,
                    useValue: {}
                },
            ],
            imports: [
                FormsModule,
                BrowserAnimationsModule,
                MaterialImportsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot()
            ],
            declarations: [ObjRulesModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjRulesModalComponent);
        component = fixture.componentInstance;
        component.data = {
            element: {},
            jsonRuleService: null,
            parentField: TEST_OBJRULESMODAL_ELEMENT
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_OBJRULESMODAL_ELEMENT: IFormElement = {
    type: 'objectList',
    key: '',
    label: ''
};
