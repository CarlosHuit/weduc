import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import {  LocalStorageService } from './services/local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    public auth:      AuthService,
    private _storage: LocalStorageService,
    private router:   Router
  ) { }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {

    const token      = this._storage.getElement('token');
    const existToken = token !== null ? true : false;

    const helper = new JwtHelperService();
    const sesionExpired = helper.isTokenExpired(token);


    if (sesionExpired || !existToken) {

      this.router.navigateByUrl('signin');
      return false;

    }

    return true;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const url: string = state.url;
    return this.checkLogin(url);

  }

  checkLogin = (url: string): boolean => {

    const token = localStorage.getItem('token');

    if ( token !== null) { return true; }

    if ( token === null) {

      this.auth.redirectUrl = url;
      this.router.navigate(['/signin']);
      return false;

    }

  }

}

