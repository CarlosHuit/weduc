import { Component, OnInit, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService         } from '../services/courses.service';
import { Subjects               } from '../interfaces/subjects';
import { DomSanitizer           } from '@angular/platform-browser';
import { MatSnackBar            } from '@angular/material';
import { DetectMobileService    } from '../services/detect-mobile.service';
import { CdkTextareaAutosize    } from '@angular/cdk/text-field';
import { AuthService            } from '../services/auth.service';
import { take } from 'rxjs/operators';
import { User } from '../classes/user';

@Component({
  selector: 'app-detail-course',
  templateUrl: './detail-course.component.html',
  styleUrls: ['./detail-course.component.css']
})
export class DetailCourseComponent implements OnInit, OnDestroy {

  @ViewChild('cBackgroundVideo')  cBackgroundVideo: ElementRef;
  @ViewChild('cdVideo')           cdVideo:          ElementRef;
  @ViewChild('videoDesktop')      videoDesktop:     ElementRef;
  @ViewChild('autosize')          autosize:         CdkTextareaAutosize;

  data:         Subjects;
  currentUser:  User;
  unsetHeight:  boolean;
  showComments: boolean;
  course:       string;
  videoUrl:     any;
  loading =     true;
  comments = [
    {
      user: 'Manuel Ramos',
      avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      comment: `Un proceso muy practico e interactivo para
                aprender lectura y escritura por medio de la adquicision de conocimiento por medio de la experiecia`
    },
    {
      user: 'Freddy Perez',
      avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      comment: `Un proceso muy practico e interactivo para
                aprender lectura y escritura por medio de la adquicision de conocimiento por medio de la experiecia`
    },
    {
      user: 'Jessica Galicia',
      avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      comment: `Un proceso muy practico e interactivo para
                aprender lectura y escritura por medio de la adquicision de conocimiento por medio de la experiecia`
    }

  ];

  constructor(
    private _sanitizer: DomSanitizer,
    private _route:     ActivatedRoute,
    private _courses:   CoursesService,
    private _mobile:    DetectMobileService,
    private _auth:      AuthService,
    private snackBar:   MatSnackBar,
    private ngZone:     NgZone,
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
          this.data     = res;
          this.videoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.data.urlVideo);
          this.loading  = false;
        },
        err => console.log(err)
      );

      (window as any).addEventListener('resize', () => this._mobile.isMobile());

  }




  ngOnDestroy() {
    window.removeEventListener('resize', () => this._mobile.isMobile());
  }

  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  addComment = (el: HTMLTextAreaElement) => {

    if (el.value.trim() === '') {

    } else {
      const x = {
        user:    this.currentUser.fullName().toString().trim(),
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        comment: el.value.trim().toString()
      };
      this.comments.unshift(x);
    }

    el.value = '';
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
