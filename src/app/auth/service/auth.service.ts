import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment          } from '../../../environments/environment';
import { MatSnackBar          } from '@angular/material';
import { JwtHelperService     } from '@auth0/angular-jwt';
import { LocalStorageService  } from '../../services/local-storage.service';
import { throwError, Observable           } from 'rxjs';
import urljoin from 'url-join';
import { SigninForm } from '../../models/forms/signin-form.model';
import { AuthResponse } from '../../models/auth-response.model';
import { SignupForm } from '../../models/forms/signup-form.model';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })

export class AuthService {


  url:          string;
  currentUser?: User;


  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private _storage: LocalStorageService
  ) {
    this.url = urljoin(environment.apiUrl, 'auth');
  }



  signup(user: SignupForm): Observable<AuthResponse> {

    const body = JSON.stringify(user);
    const url  = urljoin(this.url, 'signup');
    return this.http.post<AuthResponse>(url, body);

  }


  signin(user: SigninForm): Observable<AuthResponse> {

    const body = JSON.stringify(user);
    const url  = urljoin(this.url, 'signin');
    return this.http.post<AuthResponse>(url, body);

  }


  greetToUser = (response: User) => {

    const name   = response.firstName;
    const gender = response.avatar;

    if (gender === 'man')   { this.showError(`Bienvenido ${name}`); }
    if (gender === 'woman') { this.showError(`Bienvenida ${name}`); }

  }



  saveData = (response: AuthResponse) => {

    const { token, user } = response;

    localStorage.setItem('token', token);

    this.currentUser = new User(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.avatar,
    );

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

    }

    return !helper.isTokenExpired(token);

  }

}
