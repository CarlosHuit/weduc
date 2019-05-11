import { User } from '../user.model';
import { Answer } from './answer.model';

export class CommentResponse {

  constructor(
    public      id: string,
    public    date: Date,
    public    text: string,
    public  tempId: string,
    public    user: User,
    public answers: Answer[],
  ) {}

}
