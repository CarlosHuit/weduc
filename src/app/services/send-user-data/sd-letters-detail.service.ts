import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment       } from '../../../environments/environment';
import { GetTokenService   } from '../get-token.service';
import { catchError, map   } from 'rxjs/operators';
import { throwError        } from 'rxjs';
import { LettersDetailData } from '../../classes/letters-detail-data';
import urljoin from 'url-join';

@Injectable({
    providedIn: 'root'
  })
  export class SdLettersDetailService {

  apiUrl:      string;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private getToken: GetTokenService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/letters-detail');

  }

  sendLettersDetailData = (userData: LettersDetailData[]) => {

    const data = JSON.stringify(userData);
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.post(this.apiUrl, data, this.httpOptions)
      .pipe( catchError(this.handleError) );

  }

  handleError = (error: HttpErrorResponse) => {
    return throwError('');
  }

}

/* import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment       } from '../../../environments/environment';
import { GetTokenService   } from '../get-token.service';
import { catchError, map   } from 'rxjs/operators';
import { throwError        } from 'rxjs';
import { LettersDetailData } from '../../classes/letters-detail-data';
import urljoin from 'url-join';

@Injectable({
    providedIn: 'root'
  })
  export class SdLettersDetailService {

  apiUrl:      string;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private getToken: GetTokenService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/letters-detail');

  }

  sendLettersDetailData = (userData: LettersDetailData[]) => {

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };
    const data = JSON.stringify(userData);
    this.http.post(this.apiUrl, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );

  }

  handleError = (error: HttpErrorResponse) => {
    return throwError('');
  }

}

 */
