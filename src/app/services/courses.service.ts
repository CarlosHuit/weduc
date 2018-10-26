import { Injectable     } from '@angular/core';
import { environment    } from '../../environments/environment';
import { HttpClient     } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError     } from 'rxjs/operators';
import { Subjects       } from '../interfaces/subjects';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class CoursesService {

  apiUrl: string;
  environment: any;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = urljoin(environment.apiUrl, 'courses');
  }

  getCoursesData = () => {

    return this.http.get<Subjects[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError('GetCourses', []))
      );

  }

  getCourseData = (course: string) => {
    const url = `${this.apiUrl}/${course}`;
    return this.http.get<Subjects>(url)
      .pipe(
        catchError(this.handleError('GetCourseData', []))
      );
  }



  public handleError<T> (operation = 'operation', result?: T) {

    return (error: any): Observable<T> => {

      console.error(error.error.error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);

    };
  }

  private log(message: string) {
    console.log(message);
  }

}
