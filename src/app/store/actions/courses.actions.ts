export enum CoursesActionsType {
  GET_COURSES = '[Courses] get courses',
  SELECT_COURSE = '[Courses] select course'
}

export class GetCourses {
  static readonly type = CoursesActionsType.GET_COURSES;
}
export class SelectCourse {
  static readonly type = CoursesActionsType.SELECT_COURSE;
  constructor(public payload: { _id: string }) {}
}
