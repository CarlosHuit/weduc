import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router            } from '@angular/router';
import { environment       } from '../../../environments/environment';
import { GetTokenService   } from '../get-token.service';
import { catchError, map   } from 'rxjs/operators';
import { throwError        } from 'rxjs';
import { SelectWordsData   } from '../../classes/select-words-data';
import { AuthService       } from '../auth.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class SdSelectWordsService {

  apiUrl:      string;
  httpOptions: any;

  constructor(
    private _router:  Router,
    private http:     HttpClient,
    private _auth:    AuthService,
    private getToken: GetTokenService,
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/select-words');

  }

  sendSelectWordsData = (userData: SelectWordsData[]) => {

    const data = JSON.stringify(userData);
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.post(this.apiUrl, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );

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
