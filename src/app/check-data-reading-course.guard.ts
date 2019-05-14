import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ReadingCourseState } from './store/state/reading-course.state';
import { Navigate } from '@ngxs/router-plugin';

@Injectable({
  providedIn: 'root'
})
export class CheckDataReadingCourseGuard implements CanActivate {

  data: boolean;
  @Select(ReadingCourseState.hasData) hasData$: Observable<boolean>;

  constructor(private store: Store) {
    this.hasData$.subscribe(state => this.data = state);
  }

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log(this.data);
    if (!this.data) {

      this.store.dispatch(new Navigate(['/lectura/abecedario']));
      return false;

    }

    return true;

  }

}
