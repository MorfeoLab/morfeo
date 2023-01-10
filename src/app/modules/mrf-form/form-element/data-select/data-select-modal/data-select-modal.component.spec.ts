import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DataSelectModalComponent} from './data-select-modal.component';
import {TranslatablePipe} from '../../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataSelectData} from '../data-select-data.model';

describe('DataSelectModalComponent', () => {
    let component: DataSelectModalComponent;
    let fixture: ComponentFixture<DataSelectModalComponent>;

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
            declarations: [DataSelectModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataSelectModalComponent);
        component = fixture.componentInstance;
        component.data = TEST_DATASELECTMODAL_DATA;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

export const TEST_DATASELECTMODAL_DATA: DataSelectData = {
    field: {
        key: '',
        label: '',
        type: 'textarea'
    },
    externalData: {},
    selected: [],
    formRef: new NgForm(null, null)
}
