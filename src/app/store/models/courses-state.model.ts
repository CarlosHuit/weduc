import { Course } from '../../models/course.model';

export class CoursesStateModel {
  constructor(
    public courses:          Course[],
    public selectedCourse:   Course,
    public isLoadingCourses: boolean,
  ) {}
}
