import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage.service';
import { InitialData } from '../../classes/initial-data';
import { HandleErrorService } from '../../shared/handle-error.service';
import urljoin from 'url-join';




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


  getInitialData = (): Observable<InitialData> => {

    const data = this._storage.getElement('initialData');

    if ( data) { return this.getInitialDataFromStorage(); }
    if (!data) { return this.getInitialDataFromServer();  }

  }

  getInitialDataFromServer = (): Observable<InitialData> => {
    const url = urljoin(this.apiUrl, `initial-data`);
    return this.http.get(url)
      .pipe(tap(this.saveData), catchError(this._err.handleError));
  }

  getInitialDataFromStorage = (): Observable<InitialData> => {
    return of(this._storage.getElement('initialData'));
  }

  saveData = (x: InitialData) => {

    /* in the future save with the app version number  */
    this._storage.saveElement('initialData', x);

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
