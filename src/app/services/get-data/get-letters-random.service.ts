import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Injectable           } from '@angular/core';
import { environment          } from '../../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map        } from 'rxjs/operators';
import { GetTokenService      } from '../get-token.service';
import { LocalStorageService  } from '../local-storage.service';
import { Router               } from '@angular/router';
import { AuthService          } from '../auth.service';
import { RandomSimilarLetters } from '../../classes/random-similar-letters';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})
export class GetLettersRandomService {

  apiUrl:   string;
  httpOpts: any;

  constructor(
    private _router:  Router,
    private http:     HttpClient,
    private _auth:    AuthService,
    private getToken: GetTokenService,
    private _storage: LocalStorageService,
    ) {
      this.apiUrl = urljoin(environment.apiUrl);
      this.httpOpts = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `${this.getToken.addToken()}`
        })
      };
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
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.get<RandomSimilarLetters>(url, this.httpOpts)
      .pipe(
        map(x => { this.saveData(x); return x; }),
        catchError(this.handleError)

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

  handleError = (error: HttpErrorResponse) => {
    if (error.status === 401) {
      this._router.navigateByUrl('');
      this._auth.logout();
      this._auth.showError('Inicia sesión con un usuario válido', 2000);
      return throwError('Usuario Invalido');
    }
  }


}

