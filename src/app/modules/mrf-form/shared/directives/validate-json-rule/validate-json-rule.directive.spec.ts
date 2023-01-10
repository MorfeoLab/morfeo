import {ValidateJsonRuleDirective} from './validate-json-rule.directive';
import {UtilityService} from '../../services/utility/utility.service';
import {ConditionalService} from '../../services/conditional/conditional.service';
import {ExternalDataService} from '../../services/external-data.service';
import {async, TestBed} from '@angular/core/testing';
import {TranslatablePipe} from '../../pipes/translatable/translatable.pipe';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('ValidateJsonRuleDirective', () => {
    let utilityService,
        conditionalService,
        externalDataService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                UtilityService,
                ConditionalService,
                ExternalDataService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        utilityService = TestBed.get(UtilityService);
        conditionalService = TestBed.get(ConditionalService);
        externalDataService = TestBed.get(ExternalDataService);
    });

    it('should create an instance', () => {
        const directive = new ValidateJsonRuleDirective(
            utilityService,
            conditionalService,
            externalDataService);
        expect(directive).toBeTruthy();
    });
});

