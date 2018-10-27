import { TestBed } from '@angular/core/testing';

import { GenerateIdsService } from './generate-ids.service';

describe('GenerateIdsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenerateIdsService = TestBed.get(GenerateIdsService);
    expect(service).toBeTruthy();
  });
});
