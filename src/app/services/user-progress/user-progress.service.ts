import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router                 } from '@angular/router';
import { environment            } from '../../../environments/environment';
import { GetTokenService        } from '../get-token.service';
import { catchError, map        } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { LearnedLetters         } from '../../classes/learned-letters';
import { AuthService            } from '../auth.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class UserProgressService {

  apiUrl:      string;
  httpOpts: any;

  constructor(
    private _router:  Router,
    private http:     HttpClient,
    private _auth:    AuthService,
    private getToken: GetTokenService,
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'user-progress');

  }

  sendUserProgress = (obj: LearnedLetters) => {


    const url   = this.apiUrl;
    const data  = JSON.stringify(obj);
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.post(url, data, this.httpOpts)
      .pipe( catchError(this.handleError) );

  }

  getUserProgress = (id: string): Observable< LearnedLetters[] | any > => {

    const url = urljoin(this.apiUrl, id);
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.get<LearnedLetters[]>(url, this.httpOpts)
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
