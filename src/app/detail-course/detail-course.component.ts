import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subjects               } from '../classes/subjects';
import { DomSanitizer           } from '@angular/platform-browser';
import { MatSnackBar            } from '@angular/material';
import { DetectMobileService    } from '../services/detect-mobile.service';
import { AuthService            } from '../services/auth.service';
import { User                   } from '../classes/user';
import { GetCoursesService      } from '../services/get-data/get-courses.service';
import { MediaMatcher           } from '@angular/cdk/layout';


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

  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;



  constructor(
    private router:             Router,
    private _auth:              AuthService,
    private snackBar:           MatSnackBar,
    private _sanitizer:         DomSanitizer,
    public  media:              MediaMatcher,
    private _route:             ActivatedRoute,
    private _courses:           GetCoursesService,
    private _mobile:            DetectMobileService,
    public  changeDetectorRef:  ChangeDetectorRef,
  ) {
    this.course       = this._route.snapshot.paramMap.get('course');
    this.showComments = false;
    this.mobileQuery  = media.matchMedia('(max-width: 864px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

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
    this.mobileQuery.removeListener(this._mobileQueryListener);
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
