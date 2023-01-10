import {inject, TestBed} from '@angular/core/testing';

import {RepeatableService} from './repeatable.service';

describe('RepeatableService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RepeatableService]
        });
    });

    it('should be created', inject([RepeatableService], (service: RepeatableService) => {
        expect(service).toBeTruthy();
    }));
});
