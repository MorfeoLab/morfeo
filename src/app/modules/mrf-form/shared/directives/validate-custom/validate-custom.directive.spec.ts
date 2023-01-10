import {async, TestBed} from '@angular/core/testing';
import {ValidateCustomDirective} from './validate-custom.directive';
import {UtilityService} from '../../services/utility/utility.service';
import {TranslatablePipe} from '../../pipes/translatable/translatable.pipe';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';


describe('ValidateCustomDirective', () => {
    let utils: UtilityService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [UtilityService]
        }).compileComponents();
    }));

    beforeEach(() => {
        utils = TestBed.get(UtilityService);
    });


    it('should create an instance', () => {
        const directive = new ValidateCustomDirective(utils);
        expect(directive).toBeTruthy();
    });
});
