import { TestBed } from '@angular/core/testing';

import { SdSelectWordsService } from './sd-select-words.service';

describe('SdSelectWordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdSelectWordsService = TestBed.get(SdSelectWordsService);
    expect(service).toBeTruthy();
  });
});
