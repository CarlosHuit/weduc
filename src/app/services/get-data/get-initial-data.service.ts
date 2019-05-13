import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage.service';
import { HandleErrorService } from '../../shared/handle-error.service';
import urljoin from 'url-join';
import { Course } from 'src/app/models/course.model';
import { ReadingCourseData } from 'src/app/models/reading-course/reading-course-data.model';

@Injectable({ providedIn: 'root' })

export class GetInitialDataService {


  apiUrl: string;

  constructor(
    private http: HttpClient,
    private _storage: LocalStorageService,
    private _err: HandleErrorService
  ) {
    this.apiUrl = urljoin(environment.apiUrl);
  }


  getReadingCourseData( course: Course, userId: string ): Observable<ReadingCourseData> {

    const data = this._storage.getElement('readingCourseData');

    if ( data) {
      return this.getInitialDataFromStorage();
    }

    return this.getInitialDataFromServer(course, userId);

  }


  getInitialDataFromServer = (course: Course, userId: string): Observable<ReadingCourseData> => {

    const url = urljoin(this.apiUrl, 'courses', course.subtitle, 'data', userId);

    return this.http.get<ReadingCourseData>(url)
      .pipe(
        tap(this.saveData),
        catchError(this._err.handleError),
      );

  }


  getInitialDataFromStorage = (): Observable<ReadingCourseData> => {
    return of(this._storage.getElement('readingCourseData'));
  }


  saveData = (data: ReadingCourseData) => {

    /* in the future save with the app version number  */
    this._storage.saveElement('readingCourseData', data);

  }


}
