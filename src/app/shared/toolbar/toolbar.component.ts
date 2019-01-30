import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService       } from '../../auth/service/auth.service';
import { Store, Select     } from '@ngxs/store';
import { Logout            } from '../../store/actions/auth.actions';
import { AuthState         } from '../../store/state/auth.state';
import { Observable        } from 'rxjs';
import { Navigate          } from '@ngxs/router-plugin';
import { ChangeStateDrawer } from '../../store/actions/drawer.actions';
import { DrawerState } from '../../store/state/drawer.state';
import { AppState } from 'src/app/store/state/app.state';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})

export class ToolbarComponent implements OnDestroy, OnInit {

  statusDrawer: boolean;

  @Select(AuthState.isLoggedIn)   isLoggedIn$:  Observable<boolean>;
  @Select(AuthState.fullName)     fullName$:    Observable<string>;
  @Select(DrawerState.opened)     opened$:      Observable<boolean>;
  @Select( AppState.queryMobileMatch ) queryMobileMatch$: Observable<boolean>;


  constructor( private authService: AuthService, private store: Store ) {}

  ngOnInit() {
    this.opened$.subscribe(status => this.statusDrawer = status );
  }
  ngOnDestroy() {
  }



  toggleDrawer = () => this.store.dispatch( new ChangeStateDrawer({status: !this.statusDrawer}) );
  logout    = () => this.store.dispatch( new Logout());
  redirect  = () => this.store.dispatch( new Navigate([`user/${this.authService.currentUser.email}`]) );
  goToHome  = () => this.store.dispatch( new Navigate(['/']) );


}
