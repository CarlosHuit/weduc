import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService       } from '../../auth/service/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { MediaMatcher      } from '@angular/cdk/layout';
import { Store, Select     } from '@ngxs/store';
import { Logout            } from '../../store/actions/auth.actions';
import { AuthState         } from '../../store/state/auth.state';
import { Observable        } from 'rxjs';
import { Navigate          } from '@ngxs/router-plugin';
import { ChangeStateDrawer } from '../../store/actions/drawer.actions';
import { DrawerState } from '../../store/state/drawer.state';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})

export class ToolbarComponent implements OnDestroy, OnInit {

  mobileQuery:  MediaQueryList;
  statusDrawer: boolean;
  private _mobileQueryListener: () => void;

  @Select(AuthState.isLoggedIn)   isLoggedIn$:  Observable<boolean>;
  @Select(AuthState.fullName)     fullName$:    Observable<string>;
  @Select(DrawerState.opened)     opened$:      Observable<boolean>;


  constructor(
    private authService:        AuthService,
    public  changeDetectorRef:  ChangeDetectorRef,
    public  media:              MediaMatcher,
    private store: Store
  ) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit() {
    this.opened$.subscribe(status => this.statusDrawer = status );
  }
  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }



  toggleDrawer = () => this.store.dispatch( new ChangeStateDrawer({status: !this.statusDrawer}) );
  logout    = () => this.store.dispatch( new Logout());
  redirect  = () => this.store.dispatch( new Navigate([`user/${this.authService.currentUser.email}`]) );
  goToHome  = () => this.store.dispatch( new Navigate(['/']) );


}
