import { User } from './user';

export class Comments {

  constructor(

    public _id:         string,
    public user_id:     string | User,
    public text:        string,
    public date:        Date,
    public course_id?:  string,
    public temp_id?:    string,

  ) {}


}
