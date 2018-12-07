import { Component, OnInit, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subjects               } from '../classes/subjects';
import { DomSanitizer           } from '@angular/platform-browser';
import { MatSnackBar            } from '@angular/material';
import { DetectMobileService    } from '../services/detect-mobile.service';
import { AuthService            } from '../services/auth.service';
import { User                   } from '../classes/user';
import { GetCoursesService      } from '../services/get-data/get-courses.service';


@Component({
  selector: 'app-detail-course',
  templateUrl: './detail-course.component.html',
  styleUrls: ['./detail-course.component.css']
})
export class DetailCourseComponent implements OnInit, OnDestroy {

  @ViewChild('cBackgroundVideo')  cBackgroundVideo: ElementRef;
  @ViewChild('cdVideo')           cdVideo:          ElementRef;
  @ViewChild('videoDesktop')      videoDesktop:     ElementRef;

  data:         Subjects;
  currentUser:  User;
  unsetHeight:  boolean;
  showComments: boolean;
  course:       string;
  videoUrl:     any;
  loading =     true;
  course_id:    string;


  constructor(
    private _sanitizer: DomSanitizer,
    private _route:     ActivatedRoute,
    private _courses:   GetCoursesService,
    private _mobile:    DetectMobileService,
    private _auth:      AuthService,
    private snackBar:   MatSnackBar,

    private router:     Router,
  ) {
    this.course       = this._route.snapshot.paramMap.get('course');
    this.showComments = false;

    if (this._auth.isLoggedIn()) {
      const { userId, email, firstName, lastName } = JSON.parse(localStorage.getItem('user'));
      this.currentUser = new User(email, null, firstName, lastName, userId);
    }

  }

  ngOnInit() {

    this._courses.getCourseData(this.course)
      .subscribe(
        (res: Subjects) => {
          this.data      = res;
          this.course_id = res._id;
          this.videoUrl  = this._sanitizer.bypassSecurityTrustResourceUrl(this.data.urlVideo);
          this.loading   = false;
        },
        err => console.log(err)
      );

      (window as any).addEventListener('resize', () => this._mobile.isMobile());

  }




  ngOnDestroy() {
    window.removeEventListener('resize', () => this._mobile.isMobile());
  }




  genUrlImg = () => `/assets/img100X100/${this.data.title.toLowerCase()}-min.png`;

  redirect = (courseName: string, name: string) => {
    if (name.toLowerCase() === 'lectura') {
      this.router.navigateByUrl('lectura/abecedario');
    } else {
      this.showError(`${courseName} no se encuentra disponible por el momento.`);
    }
  }

  isMobile = () => this._mobile.isMobile();

  showError(message) {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }


}
