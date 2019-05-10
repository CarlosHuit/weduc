import { State, Selector, StateContext, Action      } from '@ngxs/store';
import { Login, Logout, IsLoading, HasError, Signup, LoginSuccess } from '../actions/auth.actions';
import { Navigate           } from '@ngxs/router-plugin';
import { tap, catchError    } from 'rxjs/operators';
import { AuthService        } from '../../auth/service/auth.service';
import { AuthStateModel     } from '../models/auth-state.model';
import { CloseDrawer        } from '../actions/drawer.actions';
import { HttpErrorResponse  } from '@angular/common/http';
import { GetCoursesSuccess, ResetCoursesData } from '../actions/courses.actions';
import { ResetDiscussionSystem } from '../actions/discussion-system.actions';
import { ResetReadingCourseData } from '../actions/reading-course/reading-course-data.actions';
import { AuthResponse } from '../../auth/models/auth-response.model';
import { User } from '../../models/user.model';

@State<AuthStateModel>({
  name: 'auth',
  defaults: initialAuth()
})

export class AuthState {


  @Selector()
  static urlAvatar({ user }: AuthStateModel) {

    return `/assets/icon-user-min/${user.avatar}-min.png`;

  }


  @Selector()
  static fullName({ user }: AuthStateModel) {

    return `${user.firstName} ${user.lastName}`;

  }


  @Selector()
  static isLoggedIn({ isLoggedIn }: AuthStateModel) {

    return isLoggedIn;

  }


  @Selector()
  static isLoading({ isLoading }: AuthStateModel) {

    return isLoading;

  }


  @Selector()
  static getEmail({ user }: AuthStateModel) {

    return user.email;

  }


  @Selector()
  static getToken({ token }: AuthStateModel) {

    return token;

  }


  @Selector()
  static userId({ user }: AuthStateModel) {

    return user.id;

  }


  @Selector()
  static getUser({ user }: AuthStateModel) {

    return user;

  }


  constructor(private _authService: AuthService) { }


  @Action(Logout)
  logout({ setState, dispatch }: StateContext<AuthStateModel>, action: Logout) {

    localStorage.clear();
    dispatch([
      new CloseDrawer(),
      new ResetCoursesData(),
      new ResetDiscussionSystem(),
      new ResetReadingCourseData(),
      new Navigate(['/signin'])
    ]);

    setState({ isLoading: false, isLoggedIn: false, token: null, user: null });

  }


  @Action(Login)
  login({ dispatch }: StateContext<AuthStateModel>, action: Login) {

    dispatch(new IsLoading({ state: true }));

    return this._authService.signin(action.payload)
      .pipe(

        tap(  res => dispatch( new LoginSuccess(res) )  ),
        catchError((err: HttpErrorResponse) => dispatch(new HasError(err)))

      );

  }


  @Action(LoginSuccess)
  loginSuccess({ dispatch, setState }: StateContext<AuthStateModel>, { payload }: LoginSuccess) {

    this._authService.saveData(payload);
    setState( initialAuth() );
    dispatch( new GetCoursesSuccess(payload.courses) );
    dispatch( new Navigate(['/']) );
    this._authService.greetToUser(payload.user);

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
    return this._authService.handleError(action.payload);

  }


  @Action(Signup)
  Signup({ dispatch }: StateContext<AuthStateModel>, action: Signup) {

    dispatch( new IsLoading({state: true}) );

    return this._authService.signup(action.payload).pipe(

      tap((res: AuthResponse) => dispatch(new LoginSuccess(res))),
      catchError((err: HttpErrorResponse) => dispatch(new HasError(err)))

    );

  }


}



function initialAuth() {

  const token = localStorage.getItem('token');
  const user: User = JSON.parse(localStorage.getItem('user'));

  if (token && user) {

    return new AuthStateModel(
      true,
      false,
      token,
      new User(
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.avatar,
      )
    );

  } else {

    return new AuthStateModel(false, false, null, null);

  }

}
