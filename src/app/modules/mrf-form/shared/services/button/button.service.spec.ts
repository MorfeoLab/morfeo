import { TestBed, inject } from '@angular/core/testing';

import { ButtonService } from './button.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ButtonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ButtonService]
    });
  });

  it('should be created', inject([ButtonService], (service: ButtonService) => {
    expect(service).toBeTruthy();
  }));
});
