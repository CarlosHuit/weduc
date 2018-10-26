import { TestBed } from '@angular/core/testing';

import { GetTokenService } from './get-token.service';

describe('GetTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetTokenService = TestBed.get(GetTokenService);
    expect(service).toBeTruthy();
  });
});
