import { UserDataModel } from './user-data.model';

export class AuthStateModel {

  constructor(
    public isLoggedIn: boolean,
    public isLoading:  boolean,
    public token:      string,
    public user:       UserDataModel,
  ) { }

}
