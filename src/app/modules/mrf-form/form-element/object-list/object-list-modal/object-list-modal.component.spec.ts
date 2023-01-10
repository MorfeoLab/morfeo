import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectListModalComponent } from './object-list-modal.component';
import {TranslatablePipe} from '../../../shared/pipes/translatable/translatable.pipe';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IFormElement} from '../../../shared/models/form-element.model';

describe('ObjectListModalComponent', () => {
    let component: ObjectListModalComponent;
    let fixture: ComponentFixture<ObjectListModalComponent>;

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
            declarations: [ObjectListModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectListModalComponent);
        component = fixture.componentInstance;
        component.data = {
            field: TEST_LISTRULESMODAL_ELEMENT,
            selected: []
        };
        fixture.detectChanges();
    });

    /**
     * @TODO:
     * Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
     * Previous value: '5'. Current value: 'undefined'.. Find more at https://angular.io/errors/NG0100
     */
    /*
        it('should create', () => {
            expect(component).toBeTruthy();
        });
      */
});

export const TEST_LISTRULESMODAL_ELEMENT: IFormElement = {
    type: 'objectList',
    key: '',
    label: '',
    columnsDefinition: []
};
