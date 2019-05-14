import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ChangeStateDrawer, CloseDrawer } from './store/actions/drawer.actions';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { DetectMobile } from './store/actions/app.actions';
import { DrawerState } from './store/state/drawer.state';
import { AuthState } from './store/state/auth.state';
import { AppState } from './store/state/app.state';
import { Logout } from './store/actions/auth.actions';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'weduc';
  statusDrawer: boolean;

  sub1: Subscription;
  sub2: Subscription;

  @Select(AppState.getTitle)    title$:      Observable<string>;
  @Select(AuthState.getEmail)   email$:      Observable<string>;
  @Select(DrawerState.opened)   opened$:     Observable<boolean>;
  @Select(AppState.isMobile)    isMobile$:   Observable<boolean>;
  @Select(AuthState.fullName)   fullName$:   Observable<string>;
  @Select(AuthState.urlAvatar)  urlAvatat$:  Observable<string>;
  @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;
  @Select(DrawerState.urlBackground) urlBackground$:    Observable<string>;
  @Select(AppState.queryMobileMatch) queryMobileMatch$: Observable<boolean>;


  constructor (
    private _titleService: Title,
    private store:         Store,
  ) { }


  ngOnInit() {

    this.sub1 = this.title$.subscribe( title => this._titleService.setTitle(title) );
    this.sub2 = this.opened$.subscribe( status => this.statusDrawer = status );

  }


  ngOnDestroy() {

    this.sub1.unsubscribe();
    this.sub2.unsubscribe();

  }


  @HostListener('window :resize') onResize() {

    this.store.dispatch(new DetectMobile());

  }


  closeDrawer() {

    this.store.dispatch( new CloseDrawer() );

  }


  toogleDrawer($event: boolean) {

    this.store.dispatch( new ChangeStateDrawer({status: !this.statusDrawer}) );

  }


  logoutAndClose = () => this.store.dispatch( [
    new CloseDrawer(),
    new Logout(),
  ])


}
