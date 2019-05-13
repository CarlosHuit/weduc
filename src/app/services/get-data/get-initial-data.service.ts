import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage.service';
import { InitialData } from '../../classes/initial-data';
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


  getInitialData = ( course: Course, userId: string ): Observable<ReadingCourseData> => {

    const data = this._storage.getElement('readingCourseData');

    if ( data) {
      return this.getInitialDataFromStorage();
    }

    return this.getInitialDataFromServer(course, userId);

  }


  getInitialDataFromServer = (course: Course, userId: string): Observable<ReadingCourseData> => {

    const url = urljoin(this.apiUrl, 'courses', course.subtitle, 'data', userId);

    return this.http.get<ReadingCourseData>(url)
      .pipe(tap(this.saveData), catchError(this._err.handleError));

  }


  getInitialDataFromStorage = (): Observable<ReadingCourseData> => {
    return of(this._storage.getElement('readingCourseData'));
  }


  saveData = (x: ReadingCourseData) => {

    /* in the future save with the app version number  */
    this._storage.saveElement('readingCourseData', x);

    /*     console.log(x);
        const words          = x.words;
        const letters        = x.letters;
        const alphabet       = letters.alphabet.split('');
        const similarLetters = x.similarLetters;
        const learnedLetters = x.learnedLetters;
        const coordinates    = x.coordinates;

        if (Storage) {

          this._storage.saveElement('alphabet',        letters.alphabet      );
          this._storage.saveElement('consonants',      letters.consonants    );
          this._storage.saveElement('vocals',          letters.vocals        );
          this._storage.saveElement('combinations',    letters.combinations  );
          this._storage.saveElement('letter_sounds',   letters.sound_letters );
          this._storage.saveElement('learned_letters', learnedLetters        );

          coordinates.forEach(c => this._storage.saveElement(`${c.letter}_coo`, c.coordinates ));

          words.forEach(el => this._storage.saveElement(`${el.l}_w`, el.w));

          const allWords = [];
          words.forEach(el => el.w.forEach(w => allWords.push(w)));
          this._storage.saveElement('words', allWords );

          alphabet.forEach(letter => {

            const d = {};
            d[letter.toLowerCase()] = similarLetters.find(e => e.l === letter.toLowerCase()).m;
            d[letter.toUpperCase()] = similarLetters.find(e => e.l === letter.toUpperCase()).m;
            localStorage.setItem(`${letter}_sl`, JSON.stringify(d));

          });

        } */

  }


}
