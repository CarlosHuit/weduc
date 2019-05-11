import { User } from './user.model';

export class Answer {

  constructor(
    public id:     string,
    public date:   Date,
    public tempId: string,
    public text:   string,
    public user:   User,
  ) {}

}
