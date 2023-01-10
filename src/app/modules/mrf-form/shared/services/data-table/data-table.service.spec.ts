import { TestBed, inject } from '@angular/core/testing';

import { DataTableService } from './data-table.service';
import {TranslatablePipe} from '../../pipes/translatable/translatable.pipe';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportsModule} from '../../../../imports/material-imports.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('DataTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataTableService]
    });
  });

  it('should be created', inject([DataTableService], (service: DataTableService) => {
    expect(service).toBeTruthy();
  }));
});
