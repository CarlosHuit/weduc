import { TestBed } from '@angular/core/testing';

import { SimilarLettersService } from './similar-letters.service';

describe('SimilarLettersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimilarLettersService = TestBed.get(SimilarLettersService);
    expect(service).toBeTruthy();
  });
});
