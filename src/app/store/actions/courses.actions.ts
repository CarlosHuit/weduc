import { Course } from '../models/courses-state.model';

export enum CoursesActionsType {
  GET_COURSES         = '[Courses] get courses',
  GET_COURSES_SUCCESS = '[Courses] get courses success',
  SELECT_COURSE       = '[Courses] select course',
  IS_LOADING_COURSES  = '[Courses] loading courses'
}

export class GetCourses {
  static readonly type = CoursesActionsType.GET_COURSES;
}


export class GetCoursesSuccess {
  static readonly type = CoursesActionsType.GET_COURSES_SUCCESS;
  constructor(public payload: Course[]) {}
}


export class SelectCourse {
  static readonly type = CoursesActionsType.SELECT_COURSE;
  constructor(public payload: { _id: string }) {}
}

export class IsLoadingCourses {
  static readonly type = CoursesActionsType.IS_LOADING_COURSES;
  constructor(public payload: {state: boolean}) {}
}
