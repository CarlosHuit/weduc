import { TestBed } from '@angular/core/testing';

import { SdDrawLettersService } from './sd-draw-letters.service';

describe('SdDrawLettersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdDrawLettersService = TestBed.get(SdDrawLettersService);
    expect(service).toBeTruthy();
  });
});
