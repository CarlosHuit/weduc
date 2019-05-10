export class User {

  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public avatar: string,
  ) {}

  fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  urlAvatar(): string {
    return `/assets/icon-user-min/${this.avatar}-min.png`;
  }

}
