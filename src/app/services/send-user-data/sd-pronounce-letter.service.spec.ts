import { TestBed } from '@angular/core/testing';

import { SdPronounceLetterService } from './sd-pronounce-letter.service';

describe('SdPronounceLetterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdPronounceLetterService = TestBed.get(SdPronounceLetterService);
    expect(service).toBeTruthy();
  });
});
