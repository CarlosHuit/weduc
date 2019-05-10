import { User } from '../../models/user.model';

export class AuthStateModel {

  constructor(
    public isLoggedIn: boolean,
    public isLoading:  boolean,
    public token:      string,
    public user:       User,
  ) { }

}
