import { User } from './user';

export class Answers {
  constructor(
    public comment_id:  string,
    public answers:     Answer[],
    public _id?:         string,
    ) {}
  }

  export class Answer {
    constructor (
      public user_id:     string | User,
      public text:        string,
      public date:        Date,
      public comment_id?: string,
      public _id?:        string,
      public temp_id?:    string,
  ) {}
}
