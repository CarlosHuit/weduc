import { Component, OnInit, HostListener  } from '@angular/core';
import { ChangeStateDrawer, CloseDrawer   } from './store/actions/drawer.actions';
import { ChangeTitle, DetectMobile        } from './store/actions/app.actions';
import { Title          } from '@angular/platform-browser';
import { Select, Store  } from '@ngxs/store';
import { Observable     } from 'rxjs';
import { AuthService    } from './services/auth.service';
import { AppState       } from './store/state/app.state';
import { DrawerState    } from './store/state/drawer.state';
import { AuthState      } from './store/state/auth.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'weduc';
  statusDrawer: boolean;
  @Select(AppState.getTitle)         title$:         Observable<string>;
  @Select(AuthState.urlAvatar)       urlAvatat$:     Observable<string>;
  @Select(AuthState.fullName)        fullName$:      Observable<string>;
  @Select(AuthState.isLoggedIn)      isLoggedIn$:    Observable<boolean>;
  @Select(AuthState.getEmail)        email$:         Observable<string>;
  @Select(DrawerState.opened)        opened$:        Observable<boolean>;
  @Select(DrawerState.urlBackground) urlBackground$: Observable<string>;

  constructor (
    private _titleService: Title,
    private _auth:         AuthService,
    private store:         Store
  ) { }

  ngOnInit() {
    this.title$.subscribe(title => this._titleService.setTitle(title));
    this.opened$.subscribe((status: boolean) => this.statusDrawer = status );
  }

  @HostListener('window :resize') onResize() {
    this.store.dispatch(new DetectMobile());
  }

  isLoggedIn = () => {
    return this._auth.isLoggedIn();
  }

  toogleDrawer = ($event: boolean) => {
    this.store.dispatch( new ChangeStateDrawer({status: !this.statusDrawer}) );
  }

  closeDrawer = () => {
    this.store.dispatch( new CloseDrawer() );
  }

}
