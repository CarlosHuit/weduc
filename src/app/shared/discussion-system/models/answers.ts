import { User } from '../../../classes/user';
import { UserDataModel } from 'src/app/store/models/user-data.model';

export class Answers {
  constructor(
    public comment_id:  string,
    public answers:     Answer[],
    public _id?:         string,
  ) {}
}


export class Answer {
  constructor (
    public user_id:     User | string | UserDataModel,
    public text:        string,
    public date:        Date,
    public comment_id?: string,
    public _id?:        string,
    public temp_id?:    string,
  ) {}
}
