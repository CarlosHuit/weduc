import { Answers } from './answers';
import { User } from '../../../classes/user';
import { UserDataModel } from 'src/app/store/models/user-data.model';

export class Comments {

  constructor(
    public _id:         string,
    public user_id:     User | string | UserDataModel,
    public text:        string,
    public date:        Date,
    public course_id?:  string,
    public temp_id?:    string,
    public answers_id?: Answers
  ) {}


}

