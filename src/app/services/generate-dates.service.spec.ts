import { TestBed } from '@angular/core/testing';

import { GenerateDatesService } from './generate-dates.service';

describe('GenerateDatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenerateDatesService = TestBed.get(GenerateDatesService);
    expect(service).toBeTruthy();
  });
});
