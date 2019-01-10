import { User } from '../../classes/user';

export enum AuthActionsTypes {
  LOGIN     = '[Auth] login',
  LOGOUT    = '[Auth] logout',
  SIGNUP    = '[Auth] signup',
  ISLOADING = '[Auht] is loading',
  HASERROR  = '[Auth] has error'
}

export class Login {
  static readonly type = AuthActionsTypes.LOGIN;
  constructor(public payload: User) {}
}


export class Logout {
  static readonly type = AuthActionsTypes.LOGOUT;
}

export class IsLoading {
  static readonly type = AuthActionsTypes.ISLOADING;
  constructor( public payload: { state: boolean } ) {}
}

export class HasError {
  static readonly type = AuthActionsTypes.HASERROR;
}

export class Signup {
  static readonly type = AuthActionsTypes.SIGNUP;
  constructor(public payload: User) {}
}
