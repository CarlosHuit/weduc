import { CoursesStateModel } from '../models/courses-state.model';
import { GetCoursesService } from '../../services/get-data/get-courses.service';
import { GetCourses        } from '../actions/courses.actions';
import { tap               } from 'rxjs/operators';
import { Subjects          } from 'src/app/classes/subjects';
import { State, Action, StateContext } from '@ngxs/store';

@State<CoursesStateModel>({
  name: 'courses',
  defaults: {
    courses: []
  }
})

export class CoursesState {


  constructor(private _getCourses: GetCoursesService) {}

  @Action( GetCourses )
  getCourses(context: StateContext<CoursesStateModel>, action: GetCourses ) {
    console.log('get courses');
    this._getCourses.getCourses().pipe(
      tap( (courses: Subjects[]) => {

        console.log(courses);
        context.setState({
          courses: courses
        });
      })
    );
  }

}


