import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable         } from '@angular/core';
import { environment        } from '../../../environments/environment';
import { GetTokenService    } from '../get-token.service';
import { catchError         } from 'rxjs/operators';
import { FindLetterData     } from '../../classes/find-letter-data';
import { HandleErrorService } from '../../shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class SdFindLettersService {

  apiUrl:      string;
  httpOptions: any;

  constructor(
    private http:     HttpClient,
    private getToken: GetTokenService,
    private _err:     HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/find-letters');

  }

  sendDrawLetters = (userData: FindLetterData) => {

    const data = JSON.stringify(userData);
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.post(this.apiUrl, data, this.httpOptions)
      .pipe(
        catchError(this._err.handleError)
      );

  }



}
