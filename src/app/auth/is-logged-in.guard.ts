import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {

  constructor( public auth: AuthService, private router: Router ) {}

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {

    const token = localStorage.getItem('token');
    const isLoggedIn = token !== null ? true : false;


    if ( isLoggedIn ) {
      this.router.navigateByUrl('');
      return false;
    }

    return true;

  }

}
