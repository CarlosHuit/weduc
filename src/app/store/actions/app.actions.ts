export enum AppActionsType {
  CHANGE_TITLE  = '[App] change title',
  DETECT_MOBILE = '[App] detect mobile',
  CHANGE_STATE_QUERY_MOBILE = '[App] Change State Query Mobile',
}


export class ChangeTitle {

  static readonly type = AppActionsType.CHANGE_TITLE;
  constructor(public payload: { title: string }) {}

}

export class DetectMobile {

  static readonly type = AppActionsType.DETECT_MOBILE;

}


export class ChangeStateMobileQuery {
  static readonly type = AppActionsType.CHANGE_STATE_QUERY_MOBILE;
  constructor(public readonly payload: { state: boolean }) {}
}

