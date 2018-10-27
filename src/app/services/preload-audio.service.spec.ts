import { TestBed } from '@angular/core/testing';

import { PreloadAudioService } from './preload-audio.service';

describe('PreloadAudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreloadAudioService = TestBed.get(PreloadAudioService);
    expect(service).toBeTruthy();
  });
});
