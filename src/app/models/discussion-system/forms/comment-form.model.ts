export class CommentForm {

  constructor(
    public date: Date,
    public text: string,
    public userId: string,
    public tempId: string,
    public courseId: string,
  ) { }

}
