import { Course } from '../../models/course.model';

export enum CoursesActionsType {
  GET_COURSES         = '[Courses] get courses',
  GET_COURSES_SUCCESS = '[Courses] get courses success',
  GET_COURSE_SUCCESS  = '[Courses] get course success',
  SELECT_COURSE       = '[Courses] select course',
  IS_LOADING_COURSES  = '[Courses] loading courses',
  RESET_DATA          = '[Courses] reset state'
}


export class GetCourses {

  static readonly type = CoursesActionsType.GET_COURSES;

}


export class GetCoursesSuccess {

  static readonly type = CoursesActionsType.GET_COURSES_SUCCESS;
  constructor(public payload: Course[]) {}

}


export class GetCourseSuccess {

  static readonly type = CoursesActionsType.GET_COURSE_SUCCESS;
  constructor(public payload: Course) {}

}


export class SelectCourse {

  static readonly type = CoursesActionsType.SELECT_COURSE;
  constructor(public payload: { course: string }) {}

}


export class IsLoadingCourses {

  static readonly type = CoursesActionsType.IS_LOADING_COURSES;
  constructor(public payload: {state: boolean}) {}

}


export class ResetCoursesData {

  static readonly type = CoursesActionsType.RESET_DATA;

}
