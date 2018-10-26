import { TestBed } from '@angular/core/testing';

import { DetectMobileService } from './detect-mobile.service';

describe('DetectMobileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetectMobileService = TestBed.get(DetectMobileService);
    expect(service).toBeTruthy();
  });
});
