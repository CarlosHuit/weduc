import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar    } from '@angular/material';
import { MediaMatcher   } from '@angular/cdk/layout';
import { Store, Select  } from '@ngxs/store';
import { SelectCourse   } from '../store/actions/courses.actions';
import { CoursesState   } from '../store/state/courses.state';
import { Observable     } from 'rxjs';
import { Course         } from '../store/models/courses-state.model';
import { AppState } from '../store/state/app.state';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})

export class CourseDetailComponent implements OnInit, OnDestroy {

  unsetHeight:  boolean;
  showComments: boolean;
  course:       string;
  course_id:    string;

  mobileQuery: MediaQueryList;
  _queryListener: () => void;


  @Select(CoursesState.isLoading)   isLoading$:   Observable<boolean>;
  @Select(CoursesState.course)      course$:      Observable<Course>;
  @Select(CoursesState.urlVideo)    urlVideo$:    Observable<Course>;
  @Select(AppState.isMobile)        isMobile$:    Observable<boolean>;

  constructor(
    private snackBar:           MatSnackBar,
    public  media:              MediaMatcher,
    private _route:             ActivatedRoute,
    public  changeDetectorRef:  ChangeDetectorRef,
    private store:              Store
  ) {
    this.course         = this._route.snapshot.paramMap.get('course');
    this.showComments   = false;
    this.mobileQuery    = media.matchMedia('(max-width: 864px)');
    this._queryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._queryListener);


  }

  ngOnInit() {
    this.store.dispatch(new SelectCourse({course: this.course}));
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._queryListener);
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
