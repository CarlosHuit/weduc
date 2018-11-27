import { TestBed } from '@angular/core/testing';

import { SdFindLettersService } from './sd-find-letters.service';

describe('SdFindLettersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdFindLettersService = TestBed.get(SdFindLettersService);
    expect(service).toBeTruthy();
  });
});
