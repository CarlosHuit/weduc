import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { Subjects } from '../interfaces/subjects';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-detail-course',
  templateUrl: './detail-course.component.html',
  styleUrls: ['./detail-course.component.css']
})
export class DetailCourseComponent implements OnInit {

  @ViewChild('cBackgroundVideo') cBackgroundVideo: ElementRef;
  data:        Subjects;
  unsetHeight: boolean;
  course:      string;
  loading =    true;
  videoUrl:    any;

  constructor(
    private _sanitizer: DomSanitizer,
    private _route:     ActivatedRoute,
    private _courses:   CoursesService,
    private router:     Router,
    private snackBar:   MatSnackBar
  ) {
    this.course = this._route.snapshot.paramMap.get('course');
  }

  ngOnInit() {

    this._courses.getCourseData(this.course)
      .subscribe(
        (res: Subjects) => {
          this.data     = res;
          this.videoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.data.urlVideo);
          this.loading  = false;
        },
        err => console.log(err)
      );

    window.addEventListener('resize', () => this.genSizes());

  }

  genSizes = (el?: HTMLDivElement) => {

    const elem: HTMLDivElement = el ? el : this.cBackgroundVideo.nativeElement;

    const orientation = window.orientation === 0 ? false : true;


    if (orientation === false) {
      return { 'width': `${elem.clientWidth}px` };
    }

    if (orientation === true) {

      const width = (elem.clientHeight / 9) * 16;
      const height = (width / 16) * 9;

      if (width > elem.clientWidth) {

        this.unsetHeight = true;
        const width2     = elem.clientWidth * 0.8;
        const height2    = (width2 / 16) * 9;

        return {
          width:   `${width2}px`,
          height:  `${height2}px`,
          padding: 0
        };

      } else {

        return {
          width:   `${width}px`,
          height:  `${height}px`,
          padding: 0
        };

      }
    }
  }

  genUrlImg = () => `/assets/img100X100/${this.data.title.toLowerCase()}-min.png`;

  redirect = (courseName: string, name: string ) => {
    if ( name.toLowerCase() === 'lectura' ) {
      this.router.navigateByUrl('lectura/abecedario');
    } else {
      this.showError(`${courseName} no se encuentra disponible por el momento.`);
    }
  }

  showError(message) {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

}
