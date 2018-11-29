import { TestBed } from '@angular/core/testing';

import { GetSimilarLettersService } from './get-similar-letters.service';

describe('GetSimilarLettersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetSimilarLettersService = TestBed.get(GetSimilarLettersService);
    expect(service).toBeTruthy();
  });
});
