import { HttpClient              } from '@angular/common/http';
import { Injectable              } from '@angular/core';
import { environment             } from '../../../environments/environment';
import { Observable              } from 'rxjs';
import { catchError              } from 'rxjs/operators';
import { Subjects                } from '../../classes/subjects';
import { HandleErrorService      } from '../../shared/handle-error.service';
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


  getCourses = (): Observable<any | Subjects[]> => {

    const url     = this.apiUrl;

    return this.http.get(url)
    .pipe(
      catchError(this._err.handleError)
    );
  }

  getCourseData = (course: string): Observable<any | Subjects> => {

    const url = urljoin(this.apiUrl, course);

    return this.http.get<Subjects>(url)
      .pipe(
        catchError(this._err.handleError)
      );

  }

}
