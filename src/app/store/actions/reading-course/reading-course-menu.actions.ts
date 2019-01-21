export enum ReadingCourseActionsType {
  LISTEN_MESSAGE             = '[Reading Course Menu] Listen Message',
  CHANGE_SORTER              = '[Reading Course Menu] Change Sorter',
  CHANGE_ACTIVE_TAB          = '[Reading Course Menu] Change Active Tab',
  SELECT_LETTER              = '[Reading Course Menu] Select Letter',
  HIGHLIGHT_LETTER           = '[Reading Course Menu] Highlight Letter',
  ACTIVE_REDIRECTION         = '[Reading Course Menu] Active Redirection',
}


export class ListenMessage {
  static readonly type = ReadingCourseActionsType.LISTEN_MESSAGE;
  constructor( public payload: { msg: string } ) {}
}

export class ChangerSorter {
  static readonly type = ReadingCourseActionsType.CHANGE_SORTER;
  constructor(public payload: {sorter: string}) {}
}

export class ChangeActiveTab {
  static readonly type = ReadingCourseActionsType.CHANGE_ACTIVE_TAB;
  constructor( public payload: { tab: string } ) {}
}

export class SelectLetter {
  static readonly type = ReadingCourseActionsType.SELECT_LETTER;
  constructor( public payload: { letter: string } ) {}
}

export class HighlightLetter {
  static readonly type = ReadingCourseActionsType.HIGHLIGHT_LETTER;
  constructor( public payload: { letter: string, type: string } ) {}
}

export class ActiveRedirection {
  static readonly type = ReadingCourseActionsType.ACTIVE_REDIRECTION;
  constructor( public payload: { url: string, msg: string, letter: string } ) {}
}
