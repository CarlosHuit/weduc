import { State, Selector, StateContext, Action      } from '@ngxs/store';
import { Login, Logout, IsLoading, HasError, Signup } from '../actions/auth.actions';
import { Navigate         } from '@ngxs/router-plugin';
import { tap, catchError  } from 'rxjs/operators';
import { throwError       } from 'rxjs';
import { User             } from '../../classes/user';
import { AuthService      } from '../../services/auth.service';
import { AuthStateModel   } from '../models/auth-state.model';
import { UserDataModel    } from '../models/user-data.model';
import { CloseDrawer      } from '../actions/drawer.actions';
import { HttpErrorResponse } from '@angular/common/http';

@State<AuthStateModel>({
  name: 'auth',
  defaults: initialAuth()
})

export class AuthState {

  @Selector()
  static isLoggedIn(state: AuthStateModel) {
    return state.isLoggedIn;
  }

  @Selector()
  static isLoading(state: AuthStateModel) {
    return state.isLoading;
  }

  @Selector()
  static getToken(state: AuthStateModel) {
    return state.token;
  }

  @Selector()
  static getUser(state: AuthStateModel) {
    return state.user;
  }

  @Selector()
  static getEmail(state: AuthStateModel) {
    return state.user.email;
  }

  @Selector()
  static fullName(state: AuthStateModel) {
    return `${state.user.firstName} ${state.user.lastName}`;
  }

  @Selector()
  static urlAvatar(state: AuthStateModel) {
    return `/assets/icon-user-min/${state.user.avatar}-min.png`;
  }

  constructor(private _authService: AuthService) { }


  @Action(Logout)
  logout({ setState, dispatch }: StateContext<AuthStateModel>, action: Logout) {
    localStorage.clear();
    dispatch( new CloseDrawer() );
    dispatch(new Navigate(['/signin']));
    setState({
      isLoading: false,
      isLoggedIn: false,
      token: null,
      user: null,
    });
  }


  @Action(Login)
  login({ setState, dispatch }: StateContext<AuthStateModel>, action: Login) {

    dispatch(new IsLoading({ state: true }));

    return this._authService.signin(action.payload).pipe(
      tap(res => {

        this._authService.saveData(res);
        setState(initialAuth());
        dispatch(new Navigate(['/']));
        this._authService.greetToUser(res);

      }),
      catchError((err: HttpErrorResponse) => {

        dispatch(new HasError());
        return this._authService.handleError(err);

      })
    );
  }


  @Action(IsLoading)
  isLoading({ patchState, getState }: StateContext<AuthStateModel>, action: IsLoading) {
    patchState({
      ...getState(),
      isLoading: action.payload.state
    });
  }


  @Action(HasError)
  hasError(context: StateContext<AuthStateModel>, action: HasError) {
    context.dispatch(new IsLoading({ state: false }));
  }


  @Action(Signup)
  Signup({ dispatch, setState, getState }: StateContext<AuthStateModel>, action: Signup) {

    dispatch( new IsLoading({state: true}) );

    return this._authService.signup(action.payload).pipe(
      tap(res => {

        this._authService.saveData(res);
        setState(initialAuth());
        dispatch(new Navigate(['/']));
        this._authService.greetToUser(res);

      }),
      catchError((err: HttpErrorResponse) => {

        dispatch(new HasError());
        return this._authService.handleError(err);

      })
    );

  }


}



function initialAuth() {

  const token = localStorage.getItem('token');
  const user: User = JSON.parse(localStorage.getItem('user'));

  if (token && user) {

    return new AuthStateModel(
      true, false,
      token, new UserDataModel(user.email, user.firstName, user.lastName, user.avatar, user._id)
    );

  } else {

    return new AuthStateModel(false, false, null, null);

  }

}
