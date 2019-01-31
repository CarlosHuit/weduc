import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatSnackBar   } from '@angular/material';
import { Subjects      } from '../classes/subjects';
import { Store, Select } from '@ngxs/store';
import { Navigate      } from '@ngxs/router-plugin';
import { GetCourses    } from '../store/actions/courses.actions';
import { CoursesState  } from '../store/state/courses.state';
import { Course        } from '../store/models/courses-state.model';
import { Observable    } from 'rxjs';
import { AppState } from '../store/state/app.state';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('contGrid') contGrid: ElementRef;

  subjects: Subjects[];
  search:   RegExp;
  isMobile: boolean;

  @Select(CoursesState.courses)   courses$:     Observable<Course[]>;
  @Select(CoursesState.isLoading) isLoading$:   Observable<boolean>;
  @Select(AppState.isMobile)      isMobile$:    Observable<boolean>;
  @Select(AppState.queryMobileMatch) queryMobileMatch$:    Observable<boolean>;

  constructor( public snackBar: MatSnackBar, private store: Store) { }

  ngOnInit() {
    this.store.dispatch( new GetCourses() );
    this.courses$.subscribe( courses => this.subjects = courses );
    this.isMobile$.subscribe( result => this.isMobile = result );
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.genCols(this.contGrid.nativeElement));
  }

  redirect = (course: string) => {

    const url = `${course}`;
    this.store.dispatch(new Navigate([url]));

  }

  showError(message) {
    this.snackBar.open(message, 'Cerrar', { duration: 5000 });
  }

  geoFindMe = () => {

    const x = document.getElementById('demo');

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(this.showPosition, this.handleErrorGeo);

    } else {
      console.log('Geolocation is not supported by this browser.');
    }


  }

  showPosition = (position) => {
    console.log(position.coords.latitude, position.coords.longitude);
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

  genCols = (el: HTMLDivElement) => {

    if (this.isMobile) {
      const t = el.clientWidth % 320;
      const margin = 5 * 4;
      const minWidth = 300;

      if (t === 0) {

        return { 'grid-template-columns': `repeat(auto-fill, ${minWidth}px)` };

      } else {

        const ts = Math.floor(el.clientWidth / 300);
        const ttt = ts * margin;
        const twidth = (el.clientWidth - ttt) / ts;

        return ({ 'grid-template-columns': `repeat(auto-fill, ${twidth}px)` });

      }

    }

    if (!this.isMobile) {

    }

  }

  searchCourses = (str: string) => {
    this.search = new RegExp(str.trim().toLowerCase());
    this.filterCourses();
  }

  filterCourses = () => {

    if (!this.search) {
      return this.subjects;
    } else {

      const result = this.subjects.filter(c => this.search.exec(c.title.toLowerCase()));
      return result;

    }
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
