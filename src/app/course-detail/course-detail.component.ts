import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar    } from '@angular/material';
import { Store, Select  } from '@ngxs/store';
import { SelectCourse   } from '../store/actions/courses.actions';
import { CoursesState   } from '../store/state/courses.state';
import { Observable     } from 'rxjs';
import { Course         } from '../models/course.model';
import { AppState } from '../store/state/app.state';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})

export class CourseDetailComponent implements OnInit {

  course: string;

  @Select(AppState.isMobile) isMobile$:  Observable<boolean>;
  @Select(CoursesState.course) course$:  Observable<Course>;
  @Select(CoursesState.urlVideo) urlVideo$:   Observable<Course>;
  @Select(CoursesState.isLoading) isLoading$: Observable<boolean>;
  @Select(AppState.queryMobileMatch) queryMobileMatch$:  Observable<boolean>;

  constructor(
    private store:    Store,
    private _route:   ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }


  ngOnInit() {

    this.course = this._route.snapshot.paramMap.get('course');
    this.store.dispatch(
      new SelectCourse({ course: this.course })
    );

  }



  redirect = (courseName: string, name: string) => {

    if (name.toLowerCase() === 'lectura') {
      this.store.dispatch(new Navigate(['lectura/abecedario']));
    }

    if (name.toLowerCase() === 'lectura') {
      this.showError(`${courseName} no se encuentra disponible por el momento.`);
    }

  }


  showError(message: string) {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }


}
