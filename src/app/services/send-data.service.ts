import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import urljoin from 'url-join';
import { environment      } from '../../environments/environment';
import { catchError, map  } from 'rxjs/operators';
import { throwError       } from 'rxjs';
import { GetTokenService  } from '../services/get-token.service';
import { LearnedLetters   } from '../classes/learned-letters';
import { PronounceLetter  } from '../interfaces/pronounce-letter';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  apiUrl:      string;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private getToken: GetTokenService
  ) {
    this.apiUrl = urljoin(environment.apiUrl, 'data');
    this.httpOptions = {
      headers: new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };
  }

  sendUserProgress = (obj: LearnedLetters) => {


    const url   = urljoin(environment.apiUrl, `user-progress`);
    const data  = JSON.stringify(obj);

    return this.http.post(url, data, this.httpOptions)
      .pipe( catchError(this.handleError) );


  }

  sendGuessLetterData = (obj: object) => {
    const token = this.getToken.getToken();
    const url   = urljoin(this.apiUrl, `guess-letter${token}`);
    const data  = JSON.stringify(obj);

    return this.http.post(url, data, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }


  private handleError (error: HttpErrorResponse) {
    const msg = `Error Status Code: ${error.status}. \n Message: ${error.error.message} \n Error: ${error.error.error}`;
    console.error(msg);

    return throwError('Algo salió mal. Por favor, vuelve a intentarlo');

  }


}
