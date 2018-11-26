import { TestBed } from '@angular/core/testing';

import { SdLettersMenuService } from './sd-letters-menu.service';

describe('SdLettersMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdLettersMenuService = TestBed.get(SdLettersMenuService);
    expect(service).toBeTruthy();
  });
});
