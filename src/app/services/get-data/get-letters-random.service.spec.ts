import { TestBed } from '@angular/core/testing';

import { GetLettersRandomService } from './get-letters-random.service';

describe('GetLettersRandomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetLettersRandomService = TestBed.get(GetLettersRandomService);
    expect(service).toBeTruthy();
  });
});
