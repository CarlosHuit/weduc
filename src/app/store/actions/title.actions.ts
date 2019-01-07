export class ChangeTitle {

  static readonly type = '[Title App] change title';
  constructor(public payload: {title: string}) {}

}
