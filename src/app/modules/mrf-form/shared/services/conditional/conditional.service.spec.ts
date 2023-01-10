import { TestBed, inject } from '@angular/core/testing';

import { ConditionalService } from './conditional.service';

describe('ConditionalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConditionalService]
    });
  });

  it('should be created', inject([ConditionalService], (service: ConditionalService) => {
    expect(service).toBeTruthy();
  }));
});