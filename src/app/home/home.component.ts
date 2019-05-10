import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetCourses } from '../store/actions/courses.actions';
import { Course } from '../store/models/courses-state.model';
import { AppState } from '../store/state/app.state';
import { CoursesState } from '../store/state/courses.state';


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
    this.store.dispatch( new GetCourses() );
    this.courses$.subscribe( courses => this.subjects = courses );
    this.isMobile$.subscribe( result => this.isMobile = result );
  }


  redirect = (course: string) => {

    const url = `${course}`;
    this.store.dispatch(new Navigate([url]));

  }


  showError(message: string) {

    this.snackBar.open(message, 'Cerrar', { duration: 5000 });

  }


  genUrl = (words: string) => {

    return `/assets/img100X100/${words.toLowerCase()}-min.png`;

  }


  handleErrorGeo = (error) => {


    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        console.log('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        console.log('An unknown error occurred.');
        break;
    }
  }


  searchCourses = (str: string) => {

    this.search = new RegExp(str.trim().toLowerCase());
    this.filterCourses();

  }


  filterCourses = () => {

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
