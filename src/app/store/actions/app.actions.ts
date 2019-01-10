export enum AppActionsType {
  CHANGE_TITLE  = '[App] change title',
  DETECT_MOBILE = '[App] detect mobile',
}


export class ChangeTitle {

  static readonly type = AppActionsType.CHANGE_TITLE;
  constructor(public payload: { title: string }) {}

}

export class DetectMobile {

  static readonly type = AppActionsType.DETECT_MOBILE;

}
