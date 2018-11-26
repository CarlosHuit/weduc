import { TestBed } from '@angular/core/testing';

import { GetInitialDataService } from './get-initial-data.service';

describe('GetInitialDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetInitialDataService = TestBed.get(GetInitialDataService);
    expect(service).toBeTruthy();
  });
});
