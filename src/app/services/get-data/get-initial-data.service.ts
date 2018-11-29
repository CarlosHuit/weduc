import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Injectable           } from '@angular/core';
import { environment          } from '../../../environments/environment';
import { Observable, of, throwError, from       } from 'rxjs';
import { map, catchError      } from 'rxjs/operators';
import { GetTokenService      } from '../get-token.service';
import { LocalStorageService  } from '../local-storage.service';
import { InitialData          } from '../../classes/initial-data';
import { Router               } from '@angular/router';
import { AuthService          } from '../auth.service';
import urljoin from 'url-join';




@Injectable({ providedIn: 'root' })

export class GetInitialDataService {


  apiUrl:   string;
  httpOpts: any;

  constructor(
    private _router:  Router,
    private http:     HttpClient,
    private _auth:    AuthService,
    private getToken: GetTokenService,
    private _storage: LocalStorageService
    ) {
      this.apiUrl = urljoin(environment.apiUrl);
      this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
      };
  }


  getInitialData = (): Observable<any | InitialData> => {

    const token   = this.getToken.getToken();
    const url     = urljoin(this.apiUrl, `initial-data`);
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };


    return this.http.get(url, this.httpOpts)
    .pipe(

      map(x => { this.saveData(x); return x; }),
      catchError(this.handleError)

    );
  }

  saveData = (x) => {

    const words          = x.words;
    const letters        = x.letters;
    const alphabet       = letters.alphabet.split('');
    const similarLetters = x.similarLetters;
    const learnedLetters = x.learnedLetters;
    const coordinates    = x.coordinates;
    /* Se selecciona la imagen */

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

    }


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
