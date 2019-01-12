import { Component    } from '@angular/core';
import { CoursesState } from 'src/app/store/state/courses.state';
import { Observable   } from 'rxjs';
import { Course    } from '../../store/models/courses-state.model';
import { Select    } from '@ngxs/store';

@Component({
  selector: 'app-details-and-comments',
  templateUrl: './details-and-comments.component.html',
  styleUrls: ['./details-and-comments.component.css']
})
export class DetailsAndCommentsComponent {

  @Select(CoursesState.course) course$: Observable<Course>;

}
