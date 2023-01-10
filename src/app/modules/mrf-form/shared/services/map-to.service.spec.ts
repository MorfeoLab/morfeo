import { TestBed, inject } from '@angular/core/testing';

import { MapToService } from './map-to.service';

describe('MapToService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapToService]
    });
  });

  it('should be created', inject([MapToService], (service: MapToService) => {
    expect(service).toBeTruthy();
  }));
});