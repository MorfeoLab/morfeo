import { TestBed, inject } from '@angular/core/testing';

import { ReadOnlyService } from './read-only.service';

describe('ReadOnlyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReadOnlyService]
    });
  });

  it('should be created', inject([ReadOnlyService], (service: ReadOnlyService) => {
    expect(service).toBeTruthy();
  }));
});