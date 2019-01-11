import { CoursesStateModel } from '../models/courses-state.model';
import { GetCoursesService } from '../../services/get-data/get-courses.service';
import { GetCourses, IsLoadingCourses        } from '../actions/courses.actions';
import { tap               } from 'rxjs/operators';
import { Subjects          } from 'src/app/classes/subjects';
import { State, Action, StateContext, Selector } from '@ngxs/store';

@State<CoursesStateModel>({
  name: 'courses',
  defaults: {
    courses: [],
    isLoadingCourses: false
  }
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

  constructor(private _getCourses: GetCoursesService) {}

  @Action( GetCourses )
  getCourses({ getState, setState, dispatch }: StateContext<CoursesStateModel>, action: GetCourses ) {

    const state = getState();

    if (state.courses.length === 0) {

      dispatch(new IsLoadingCourses({state: true}));

      return this._getCourses.getCourses().pipe(
        tap( (courses: Subjects[]) => {

          setState({ courses: courses, isLoadingCourses: false });
          dispatch(new IsLoadingCourses({ state: false }));

        })
      );

    }
  }

  @Action(IsLoadingCourses)
  isLoadingCourses({ patchState, getState }: StateContext<CoursesStateModel>, action: IsLoadingCourses) {
    patchState({
      ...getState(),
      isLoadingCourses: action.payload.state
    });
  }

}


