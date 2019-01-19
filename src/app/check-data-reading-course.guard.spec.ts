import { TestBed, async, inject } from '@angular/core/testing';

import { CheckDataReadingCourseGuard } from './check-data-reading-course.guard';

describe('CheckDataReadingCourseGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckDataReadingCourseGuard]
    });
  });

  it('should ...', inject([CheckDataReadingCourseGuard], (guard: CheckDataReadingCourseGuard) => {
    expect(guard).toBeTruthy();
  }));
});
