import { Injectable } from '@angular/core';
import urljoin from 'url-join';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { JwtHelperService } from '@auth0/angular-jwt';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })

export class AuthService {


  usersUrl: string;
  currentUser?: User; // Usuario actual


  constructor(
    private http: HttpClient,
    private router: Router,
    public snackBar: MatSnackBar,
  ) {

    this.usersUrl = urljoin(environment.apiUrl, 'auth');

    if (this.isLoggedIn()) {

      const { userId, email,  firstName, lastName } = JSON.parse(localStorage.getItem('user'));
      this.currentUser = new User(email, null, null, firstName, lastName, userId);

    }

  }



  signup(user: User) {

    const us = JSON.stringify(user); // to JSON

    return this.http.post(urljoin(this.usersUrl, 'signup'), us, httpOptions)
      .pipe(
        map(
          (response: Response) => {
            const json = response;
            this.login(json);
            return json;
          }
        )
      );
  }



  signin(user: User) {

    const us = JSON.stringify(user); // to JSON

    return this.http.post(urljoin(this.usersUrl, 'signin'), us, httpOptions)
      .pipe(
        map(
          (response: Response) => {
            const json = response;
            return json;
          }
        )
      );
  }





  login = (response: any) => {

    const { token, userId, firstName, lastName, email } = response;
    this.currentUser = new User(email, null, null, firstName, lastName, userId);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ userId, firstName, lastName, email }));

    this.router.navigateByUrl('');

  }



  showError(message, time?) {
    this.snackBar.open(message, 'Cerrar', { duration: time || 2000 });
  }



  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }



  logout() {
    localStorage.clear();
    this.currentUser = null;
    this.router.navigateByUrl('/signin');
  }



  public handleError = (response: HttpErrorResponse) => {

    /*     const { error: { name }, message } = response; */
    console.error(response.error.error);
    this.showError(response.error.error);
    /*     this.logout(); */

    return response;

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
