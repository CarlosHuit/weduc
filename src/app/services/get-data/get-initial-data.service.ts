import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Injectable           } from '@angular/core';
import { environment          } from '../../../environments/environment';
import { Observable           } from 'rxjs';
import { map, catchError      } from 'rxjs/operators';
import { GetTokenService      } from '../get-token.service';
import { LocalStorageService  } from '../local-storage.service';
import { InitialData          } from '../../classes/initial-data';
import { HandleErrorService   } from '../../shared/handle-error.service';
import urljoin from 'url-join';




@Injectable({ providedIn: 'root' })

export class GetInitialDataService {


  apiUrl:   string;
  httpOpts: any;

  constructor(
    private http:     HttpClient,
    private getToken: GetTokenService,
    private _storage: LocalStorageService,
    private _err:     HandleErrorService
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
      catchError(this._err.handleError)

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


}
