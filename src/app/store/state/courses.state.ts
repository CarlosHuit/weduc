import { CoursesStateModel } from '../models/courses-state.model';
import { Course } from '../../models/course.model';
import { GetCoursesService } from '../../services/get-data/get-courses.service';
import {
  GetCourses,
  IsLoadingCourses,
  GetCoursesSuccess,
  SelectCourse,
  GetCourseSuccess,
  ResetCoursesData
} from '../actions/courses.actions';
import { tap               } from 'rxjs/operators';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { DomSanitizer } from '@angular/platform-browser';


const initialData: CoursesStateModel = {
  courses: [],
  selectedCourse: null,
  isLoadingCourses: false,
};


@State<CoursesStateModel>({
  name: 'courses',
  defaults: initialData
})

export class CoursesState {

  @Selector()
  static courses({ courses }: CoursesStateModel) {
    return courses;
  }

  @Selector()
  static isLoading({ isLoadingCourses }: CoursesStateModel) {
    return isLoadingCourses;
  }

  @Selector()
  static course({ selectedCourse }: CoursesStateModel) {
    return selectedCourse;
  }

  @Selector()
  static courseId({ selectedCourse }: CoursesStateModel) {
    return selectedCourse.id;
  }

  @Selector()
  static courseSubtitle({ selectedCourse }: CoursesStateModel) {
    return selectedCourse.subtitle;
  }

  @Selector()
  static urlVideo({ selectedCourse }: CoursesStateModel) {
    return selectedCourse.urlVideo;
  }

  constructor(private _getCourses: GetCoursesService, public _sanitizer: DomSanitizer) {}

  @Action( GetCourses )
  getCourses({ getState, dispatch }: StateContext<CoursesStateModel>, action: GetCourses ) {
    const state = getState();

    if (state.courses.length === 0) {
      dispatch(new IsLoadingCourses({state: true}));
      return this._getCourses.getCourses()
        .pipe(
          tap( (courses: Course[]) => dispatch( new GetCoursesSuccess(courses) )),
        );

    }

  }

  @Action(GetCoursesSuccess)
  getCoursesSuccess({ patchState }: StateContext<CoursesStateModel>, action: GetCoursesSuccess) {

    patchState({
      courses: action.payload,
      isLoadingCourses: false
    });

  }

  @Action(GetCourseSuccess)
  getCourseSuccess({ patchState, getState, dispatch }: StateContext<CoursesStateModel>, { payload }: GetCourseSuccess) {

    const safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(payload.urlVideo);
    const course: any = Object.assign({}, payload);
    course.urlVideo = safeUrl;
    course.imageUrl = `/assets/img100X100/${payload.title.toLowerCase()}-min.png`;

    patchState(
      {
        ...getState(),
        selectedCourse:   course,
      }
    );
    return dispatch( new IsLoadingCourses({state: false}));
  }

  @Action(IsLoadingCourses)
  isLoadingCourses({ patchState, getState }: StateContext<CoursesStateModel>, action: IsLoadingCourses) {

    return patchState(
      {
        ...getState(),
        isLoadingCourses: action.payload.state
      }
    );

  }

  @Action(SelectCourse)
  selectCourse({ dispatch, getState }: StateContext<CoursesStateModel>, { payload }: SelectCourse) {

    dispatch(new IsLoadingCourses({state: true}));

    const state = getState();
    const course = state.courses.find(c => c.subtitle === payload.course);

    if (course) {
      return dispatch(new GetCourseSuccess(course));
    }


    return this._getCourses.getCourseDetail(payload.course).pipe(

      tap(c => dispatch(new GetCourseSuccess(c)))

    );


  }

  @Action(ResetCoursesData)
  resetCoursesData ( {setState}: StateContext<CoursesStateModel>, action: ResetCoursesData) {
    setState(initialData);
  }

}


