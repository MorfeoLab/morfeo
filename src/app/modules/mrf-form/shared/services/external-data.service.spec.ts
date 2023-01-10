import { TestBed, inject } from '@angular/core/testing';

import { ExternalDataService } from './external-data.service';

describe('ExternalDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalDataService]
    });
  });

  it('should be created', inject([ExternalDataService], (service: ExternalDataService) => {
    expect(service).toBeTruthy();
  }));
});