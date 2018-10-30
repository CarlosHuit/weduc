import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { DetectMobileService } from '../services/detect-mobile.service';
import { Subjects } from '../interfaces/subjects';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  @ViewChild('contGrid') contGrid: ElementRef;

  subjects: Subjects[];
  loading = true;
  search: RegExp;

  constructor(
    private detectMobile: DetectMobileService,
    private getCourses: CoursesService,
    private router: Router,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getCourses.getCoursesData()
      .subscribe(
        (val: Subjects[]) => {
          this.subjects = val;
          this.loading = false;
          (window as any).onresize = () => this.genCols(this.contGrid.nativeElement);
        },
        err => console.log(err)
      );


  }


  redirect = (course: string) => {

    const url = `${course}`;
    this.router.navigateByUrl(url);

  }

  showError(message) {
    this.snackBar.open(message, 'Cerrar', { duration: 5000 });
  }

  generateUrl = (str: string) => {
    return `/assets/courses-img/${str}.jpg`;
  }

  isMobile = () => {
    return this.detectMobile.isMobile();
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

    if (this.isMobile()) {
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

    if (!this.isMobile()) {

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



}
