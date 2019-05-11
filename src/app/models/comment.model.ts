import { User } from './user.model';
import { Answer } from './answer.model';

export class CommentResponse {

  constructor(
    public readonly      id: string,
    public readonly    date: Date,
    public readonly    text: string,
    public readonly  tempId: string,
    public readonly    user: User,
    public readonly answers: Answer[],
  ) {}

}
