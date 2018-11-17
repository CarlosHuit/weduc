import { TestBed } from '@angular/core/testing';

import { GetWordsService } from './get-words.service';

describe('GetWordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetWordsService = TestBed.get(GetWordsService);
    expect(service).toBeTruthy();
  });
});
