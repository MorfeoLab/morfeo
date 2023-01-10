import { TranslatablePipe } from './translatable.pipe';
import {async, TestBed} from '@angular/core/testing';
import {UtilityService} from '../../services/utility/utility.service';
import {ConditionalService} from '../../services/conditional/conditional.service';
import {ExternalDataService} from '../../services/external-data.service';

describe('TranslatablePipe', () => {
  let utilityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        UtilityService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    utilityService = TestBed.get(UtilityService);
  });

  it('create an instance', () => {
    const pipe = new TranslatablePipe(utilityService);
    expect(pipe).toBeTruthy();
  });
});
