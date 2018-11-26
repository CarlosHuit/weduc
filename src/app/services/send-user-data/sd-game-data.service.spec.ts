import { TestBed } from '@angular/core/testing';

import { SdGameDataService } from './sd-game-data.service';

describe('SdGameDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdGameDataService = TestBed.get(SdGameDataService);
    expect(service).toBeTruthy();
  });
});
