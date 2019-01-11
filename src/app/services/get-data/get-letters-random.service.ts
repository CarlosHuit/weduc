import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable              } from '@angular/core';
import { environment             } from '../../../environments/environment';
import { Observable, of          } from 'rxjs';
import { catchError, map         } from 'rxjs/operators';
import { LocalStorageService     } from '../local-storage.service';
import { RandomSimilarLetters    } from '../../classes/random-similar-letters';
import { HandleErrorService      } from '../../shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})
export class GetLettersRandomService {

  apiUrl:   string;

  constructor(
    private http:     HttpClient,
    private _storage: LocalStorageService,
    private _err:     HandleErrorService
    ) {
      this.apiUrl = urljoin(environment.apiUrl);
    }

  getSimilarLettersRandom = (letter: string): Observable<any | RandomSimilarLetters> => {

    const t = this._storage.getElement(`${letter.toLowerCase()}_sl`);

    if (!Storage || t === null) {
      return this.getSimilarLettersRandomFromServer(letter);
    }

    if ( Storage && t !== null) {
      return of(this.getDataFromStorage(letter));
    }

  }

  getSimilarLettersRandomFromServer (letter: string): Observable<any | RandomSimilarLetters> {

    const url = urljoin(this.apiUrl, `similar-letters/random/${letter}`);

    return this.http.get<RandomSimilarLetters>(url)
      .pipe(
        map(x => { this.saveData(x); return x; }),
        catchError(this._err.handleError)

      );
  }

  saveData = (data) => {

    const d = data as RandomSimilarLetters;
    const x = {};
    x[d.l.letter] = d.l.similarLetters;
    x[d.u.letter] = d.u.similarLetters;

    this._storage.saveElement(`${d.l.letter}_sl`, x);
  }

  getDataFromStorage = (letter: string) => {

    const letterLC = letter.toLowerCase();
    const letterUC = letter.toUpperCase();

    try {

      const data = this._storage.getElement(`${letter.toLowerCase()}_sl`);

      const similarLowerCase = data[letterLC];
      const similarUpperCase = data[letterUC];

      const lowerCaseRandom = [];
      const upperCaseRandom = [];
      const amountLowerCase = this.randomInt(8, 12);
      const amountUpperCase = this.randomInt(8, 12);

      for (let i = 0; i < amountLowerCase; i++) { lowerCaseRandom.push(letterLC); }
      for (let i = 0; i < amountUpperCase; i++) { upperCaseRandom.push(letterUC); }


      for (let i = 0; i < 3; i++) {

        lowerCaseRandom.push(similarLowerCase[i]);
        upperCaseRandom.push(similarUpperCase[i]);

        similarLowerCase.forEach(ltr => lowerCaseRandom.push(ltr));
        similarUpperCase.forEach(ltr => upperCaseRandom.push(ltr));

      }


      const randomLowerCase = this.messUpWords(lowerCaseRandom);
      const randomUpperCase = this.messUpWords(upperCaseRandom);

      const upper = [];
      const lower = [];

      for (let i = 0; i < randomLowerCase.length; i++) {
        const element = `${randomLowerCase[i]}${i}`;
        lower.push(element);
      }

      for (let i = 0; i < randomUpperCase.length; i++) {
        const element = `${randomUpperCase[i]}${i}`;
        upper.push(element);
      }

      // return { upperCase: upper,  lowerCase: lower };
      return new RandomSimilarLetters(upper, lower, similarUpperCase, similarLowerCase);


    } catch (error) {
      console.log(error);
    }
  }

  messUpWords = (words) => {

    let messy = [];

    while (true) {

      if (!words.length) { break; }

      const extraction = words.shift();
      const random     = Math.floor(Math.random() * (messy.length + 1));
      const start      = messy.slice(0, random);
      const medium     = extraction;
      const end        = messy.slice(random, messy.length);

      messy = (start).concat(medium).concat(end);

    }

    return messy;

  }

  randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }


}

