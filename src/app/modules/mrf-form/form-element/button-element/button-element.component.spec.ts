import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonElementComponent } from './button-element.component';
import {FormsModule} from '@angular/forms';
import {MaterialImportsModule} from '../../../imports/material-imports.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';

describe('ButtonElementComponent', () => {
    let component: ButtonElementComponent;
    let fixture: ComponentFixture<ButtonElementComponent>;

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
            declarations: [ButtonElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
