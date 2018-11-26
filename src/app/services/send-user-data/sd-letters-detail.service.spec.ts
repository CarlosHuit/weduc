import { TestBed } from '@angular/core/testing';

import { SdLettersDetailService } from './sd-letters-detail.service';

describe('SdLettersDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdLettersDetailService = TestBed.get(SdLettersDetailService);
    expect(service).toBeTruthy();
  });
});
