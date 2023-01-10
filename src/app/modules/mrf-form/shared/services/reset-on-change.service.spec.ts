import { TestBed, inject } from '@angular/core/testing';

import { ResetOnChangeService } from './reset-on-change.service';

describe('ResetOnChangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResetOnChangeService]
    });
  });

  it('should be created', inject([ResetOnChangeService], (service: ResetOnChangeService) => {
    expect(service).toBeTruthy();
  }));
});