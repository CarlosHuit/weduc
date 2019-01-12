import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService  } from '../services/local-storage.service';
import { Injectable           } from '@angular/core';
import { Observable           } from 'rxjs';
import { JwtHelperService     } from '@auth0/angular-jwt';
import { Store                } from '@ngxs/store';
import { Navigate             } from '@ngxs/router-plugin';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private _storage: LocalStorageService,
    private store: Store
  ) { }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {

    const token      = this._storage.getElement('token');
    const existToken = token !== null ? true : false;

    const helper = new JwtHelperService();
    const sesionExpired = helper.isTokenExpired(token);


    if (sesionExpired || !existToken) {

      this.store.dispatch(new Navigate(['/signin']));
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

      this.store.dispatch(new Navigate(['/signin']));
      return false;

    }

  }

}

