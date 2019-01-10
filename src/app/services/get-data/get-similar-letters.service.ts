import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Injectable           } from '@angular/core';
import { environment          } from '../../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map        } from 'rxjs/operators';
import { GetTokenService      } from '../get-token.service';
import { LocalStorageService  } from '../local-storage.service';
import { SimilarLetters       } from '../../classes/similar-letters';
import { HandleErrorService   } from '../../shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})
export class GetSimilarLettersService {

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

  getSimilarLetters = (letter: string): Observable<any | SimilarLetters[]> => {

    const data = this._storage.getElement(`${letter}_sl`);

    if (!Storage || data === null ) { return this.getSimilarLettersOfServer(letter); }

    if (Storage && data) { return this.getSimilarLettersOfStorage(letter); }
  }




  getSimilarLettersOfStorage = (letter: string): Observable<any | SimilarLetters[]> => {

    const data = this._storage.getElement(`${letter}_sl`);
    return of(data);

  }



  getSimilarLettersOfServer (letter: string): Observable<any | SimilarLetters[]> {

    const url = urljoin(this.apiUrl, `similar-letters/${letter}`);
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.get<SimilarLetters[]>(url, this.httpOpts)
      .pipe(
        map(x => this.convertData(x, letter)),
        catchError(this._err.handleError)

      );
  }

  convertData = (data, letter: string) => {

    const x = data as SimilarLetters[];

    const upperIndex = x.findIndex(m => m.letter === letter.toUpperCase() );
    const lowerIndex = x.findIndex(w => w.letter === letter.toLowerCase() );
    const upper = x[upperIndex];
    const lower = x[lowerIndex];

    const q = {};
    q[letter.toUpperCase()] = upper.similarLetters;
    q[letter.toLowerCase()] = lower.similarLetters;

    this._storage.saveElement(`${letter.toLowerCase()}_sl`, q);

    return q;

  }


}

