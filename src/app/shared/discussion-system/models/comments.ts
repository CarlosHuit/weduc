import { Answers } from './answers';
import { User } from '../../../classes/user';

export class Comments {

  constructor(
    public _id:         string,
    public user_id:     User | string,
    public text:        string,
    public date:        Date,
    public course_id?:  string,
    public temp_id?:    string,
    public answers_id?: Answers
  ) {}


}

