export enum CoursesActionsType {
  GET_COURSES = '[Courses] get courses',
  SELECT_COURSE = '[Courses] select course',
  IS_LOADING_COURSES = '[Courses] loading courses'
}

export class GetCourses {
  static readonly type = CoursesActionsType.GET_COURSES;
}
export class SelectCourse {
  static readonly type = CoursesActionsType.SELECT_COURSE;
  constructor(public payload: { _id: string }) {}
}

export class IsLoadingCourses {
  static readonly type = CoursesActionsType.IS_LOADING_COURSES;
  constructor(public payload: {state: boolean}) {}
}
