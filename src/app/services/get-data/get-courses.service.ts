import { HttpClient              } from '@angular/common/http';
import { Injectable              } from '@angular/core';
import { environment             } from '../../../environments/environment';
import { Observable              } from 'rxjs';
import { catchError              } from 'rxjs/operators';
import { HandleErrorService      } from '../../shared/handle-error.service';
import { Course } from '../../models/course.model';
import urljoin from 'url-join';




@Injectable({ providedIn: 'root' })

export class GetCoursesService {


  apiUrl:   string;

  constructor(
    private http:     HttpClient,
    private _err:     HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'courses');

  }


  getCourses = (): Observable<Course[]> => {

    const url     = this.apiUrl;
    return this.http.get<Course[]>(url)
    .pipe(
      catchError(this._err.handleError)
    );
  }

  getCourseDetail = (courseName: string): Observable<Course> => {

    const url = urljoin(this.apiUrl, courseName);

    return this.http.get<Course>(url)
      .pipe(
        catchError(this._err.handleError)
      );

  }

}
