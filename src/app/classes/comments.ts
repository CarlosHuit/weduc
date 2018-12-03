export class Comments {

  constructor(

    public course_id:   string,
    public user_id:     string,
    public avatar:      string,
    public text:        string,
    public date:        Date,
    public fistName?:   string,
    public lastName?:   string,

  ) {}

  fullName = () => `${this.fistName} ${this.lastName}`;

}
