import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router            } from '@angular/router';
import { environment       } from '../../../environments/environment';
import { GetTokenService   } from '../get-token.service';
import { catchError, map   } from 'rxjs/operators';
import { throwError        } from 'rxjs';
import { DrawLettersData   } from '../../classes/draw-letter-data';
import { AuthService       } from '../auth.service';
import urljoin from 'url-join';
import { Store } from '@ngxs/store';
import { Logout } from 'src/app/store/actions/auth.actions';

@Injectable({
  providedIn: 'root'
})

export class SdDrawLettersService {

  apiUrl:      string;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private _router: Router,
    private getToken: GetTokenService,
    private store: Store
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/draw-letters');

  }

  sendDrawLetters = (userData: DrawLettersData[]) => {

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
      this.store.dispatch(new Logout());
      this._auth.showError('Inicia sesión con un usuario válido', 2000);
      return throwError('Usuario Invalido');
    }
  }

}
