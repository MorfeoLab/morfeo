import { TestBed, inject } from '@angular/core/testing';

import { ComboService } from './combo.service';

describe('ComboService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComboService]
    });
  });

  it('should be created', inject([ComboService], (service: ComboService) => {
    expect(service).toBeTruthy();
  }));
});