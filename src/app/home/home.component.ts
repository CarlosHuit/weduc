import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetCourses } from '../store/actions/courses.actions';
import { Course } from '../store/models/courses-state.model';
import { AppState } from '../store/state/app.state';
import { CoursesState } from '../store/state/courses.state';
import { ChangeTitle } from '../store/actions/app.actions';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {


  subjects: Course[];
  search:   RegExp;
  isMobile: boolean;

  @Select(CoursesState.courses)   courses$:     Observable<Course[]>;
  @Select(CoursesState.isLoading) isLoading$:   Observable<boolean>;
  @Select(AppState.isMobile)      isMobile$:    Observable<boolean>;
  @Select(AppState.queryMobileMatch) queryMobileMatch$:    Observable<boolean>;


  constructor(
    private store:   Store,
    public snackBar: MatSnackBar,
  ) { }


  ngOnInit() {

    this.store.dispatch( new ChangeTitle({ title: 'Weduc - Cursos' }) );
    this.store.dispatch( new GetCourses() );

    this.courses$.subscribe( courses => this.subjects = courses );
    this.isMobile$.subscribe( result => this.isMobile = result );

  }


  redirect = (course: string) => {

    const url = `${course}`;
    this.store.dispatch(new Navigate([url]));

  }


  showError(message: string): void {

    this.snackBar.open(message, 'Cerrar', { duration: 5000 });

  }


  genUrl(words: string): string {

    return `/assets/img100X100/${words.toLowerCase()}-min.png`;

  }


  searchCourses(str: string): void {

    this.search = new RegExp(str.trim().toLowerCase());
    this.filterCourses();

  }


  filterCourses(): Course[] {

    if (!this.search) {
      return this.subjects;
    }

    const result = this.subjects.filter(c => this.search.exec(c.title.toLowerCase()));
    return result;

  }


  grids = (el: HTMLDivElement) => {

    const width    = el.clientWidth - 20;
    const widthCol = 250;
    const residue  = width % widthCol;

    if (residue > 0) {
      const exactColumns = Math.floor(width / widthCol);
      const widthColumn  = width / exactColumns;
      return {
        'grid-template-columns': `repeat(auto-fill, ${widthColumn}px)`
      };
    }

  }



}
