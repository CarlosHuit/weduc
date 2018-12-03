import { TestBed } from '@angular/core/testing';

import { DiscussionSystemService } from './discussion-system.service';

describe('DiscussionSystemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscussionSystemService = TestBed.get(DiscussionSystemService);
    expect(service).toBeTruthy();
  });
});
