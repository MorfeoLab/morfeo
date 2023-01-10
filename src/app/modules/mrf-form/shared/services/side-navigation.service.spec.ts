import { TestBed, inject } from '@angular/core/testing';

import { SideNavigationService } from './side-navigation.service';

describe('SideNavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SideNavigationService]
    });
  });

  it('should be created', inject([SideNavigationService], (service: SideNavigationService) => {
    expect(service).toBeTruthy();
  }));
});