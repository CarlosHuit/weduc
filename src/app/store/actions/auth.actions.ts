import { HttpErrorResponse } from '@angular/common/http';
import { SigninForm } from 'src/app/models/forms/signin-form.model';
import { AuthResponse } from '../../models/auth-response.model';
import { SignupForm } from '../../models/forms/signup-form.model';

export enum AuthActionsTypes {
  LOGIN         = '[Auth] login',
  LOGIN_SUCCESS = '[Auth] login success',
  LOGOUT        = '[Auth] logout',
  SIGNUP        = '[Auth] signup',
  IS_LOADING    = '[Auht] is loading',
  HAS_ERROR     = '[Auth] has error'
}


export class Login {

  static readonly type = AuthActionsTypes.LOGIN;
  constructor(public payload: SigninForm) {}

}


export class LoginSuccess {

  static readonly type = AuthActionsTypes.LOGIN_SUCCESS;
  constructor(public payload: AuthResponse) {}

}


export class Logout {

  static readonly type = AuthActionsTypes.LOGOUT;

}


export class IsLoading {

  static readonly type = AuthActionsTypes.IS_LOADING;
  constructor( public payload: { state: boolean } ) {}

}


export class HasError {

  static readonly type = AuthActionsTypes.HAS_ERROR;
  constructor(public payload: HttpErrorResponse) {}

}

export class Signup {

  static readonly type = AuthActionsTypes.SIGNUP;
  constructor(public payload: SignupForm) {}

}
