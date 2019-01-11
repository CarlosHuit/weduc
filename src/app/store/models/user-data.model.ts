export class UserDataModel {

  constructor(
    public email:     string,
    public firstName: string,
    public lastName:  string,
    public avatar:    string,
    public _id:       string,
  ) {}

    urlAvatar = () => `/assets/icon-user-min/${this.avatar}-min.png`;
    fullName  = () => `${this.firstName} ${this.lastName}`;

}

