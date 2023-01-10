import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DataTableComponent} from './data-table.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {FormsModule, NgForm} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {IFormElement} from '../../shared/models/form-element.model';

describe('DataTableComponent', () => {
    let component: DataTableComponent;
    let fixture: ComponentFixture<DataTableComponent>;

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
            declarations: [DataTableComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableComponent);
        component = fixture.componentInstance;
        component.field = TEST_DATATABLE_ELEMENT;
        component.formRef = new NgForm(null, null);
        fixture.detectChanges();
    });

    /**
     * @TODO:
     * Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
     * Previous value for 'innerHTML': '?'. Current value: '9'.. Find more at https://angular.io/errors/NG0100
     */
    /*
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    */
});

export const TEST_DATATABLE_ELEMENT: IFormElement = {
    type: 'dataTable',
    key: 'table1',
    dataSrc: 'values',
    data: {
        values: [
            {
                id: 9,
                birth_date: '04-02-2009',
                first_name: 'Brandy',
                last_name: 'Rutty',
                email: 'brutty8@nyu.edu'
            },
            {
                id: 8,
                birth_date: '17-04-1998',
                first_name: 'Sabine',
                last_name: 'Burgoine',
                email: 'sburgoine7@ebay.co.uk'
            },
            {
                id: 10,
                birth_date: '19-01-2006',
                first_name: 'Audrye',
                last_name: 'Hewkin',
                email: 'ahewkin9@nbcnews.com'
            }
        ],
        columns: [
            {
                value: 'id',
                label: 'ID'
            },
            {
                value: 'first_name',
                label: 'Nome'
            },
            {
                value: 'last_name',
                label: 'Cognome'
            },
            {
                value: 'email',
                label: 'Email'
            }
        ]
    },
    suffix: '',
    hidden: false,
    defaultValue: null,
    validate: {
        custom: ''
    },
    input: true
};
