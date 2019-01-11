import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment          } from '../../../environments/environment';
import { User                 } from '../../classes/user';
import { MatSnackBar          } from '@angular/material';
import { JwtHelperService     } from '@auth0/angular-jwt';
import { LocalStorageService  } from '../../services/local-storage.service';
import { throwError, Observable           } from 'rxjs';
import { UserDataModel        } from '../../store/models/user-data.model';
import urljoin from 'url-join';
import { ResponseAuth } from '../models/response-auth.model';


@Injectable({ providedIn: 'root' })

export class AuthService {


  url:          string;
  currentUser?: UserDataModel;


  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private _storage: LocalStorageService
  ) {
    this.url = urljoin(environment.apiUrl, 'auth');
  }



  signup(user: User): Observable<ResponseAuth> {

    const body = JSON.stringify(user);
    const url  = urljoin(this.url, 'signup');
    return this.http.post<ResponseAuth>(url, body);

  }


  signin(user: User): Observable<ResponseAuth> {

    const body = JSON.stringify(user);
    const url  = urljoin(this.url, 'signin');
    return this.http.post<ResponseAuth>(url, body);

  }


  greetToUser = (response: any) => {

    const name = response.firstName;
    const gender = response.avatar;

    if (gender === 'man')   { this.showError(`Bienvenido ${name}`); }
    if (gender === 'woman') { this.showError(`Bienvenida ${name}`); }

  }



  saveData = (response: any) => {

    const { token, userId, firstName, lastName, email, avatar } = response;

    localStorage.setItem('token', token);
    this.currentUser = new UserDataModel(email, firstName, lastName, avatar, userId);
    this._storage.saveElement('user', this.currentUser);

  }



  showError(message: string, time?: number) {
    this.snackBar.open(message, 'Cerrar', { duration: time || 2000 });
  }



  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  handleError = (response: HttpErrorResponse) => {

    this.showError(response.error.error);
    return throwError(response.error.message);

  }

  public isAuthenticated(): boolean {

    const helper = new JwtHelperService();
    const token = localStorage.getItem('token');

    if (token === null) {

      return false;

    } else {

      return !helper.isTokenExpired(token);
    }

  }

}