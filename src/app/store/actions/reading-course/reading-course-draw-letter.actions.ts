export enum ReadingCourseDrawLetterActionsType {
  IS_SETTING_DATA  = '[Reading Course Draw Letter] Is Setting Data',
  SET_INITIAL_DATA = '[Reading Course Draw Letter] Set Initial Data',
  SET_CURRENT_DATA = '[Reading Course Draw Letter] Set Current Data',
  CHANGE_CURRENT_DATA = '[Reading Course Draw Letter] Change Current Data',

  CHANGE_LINE_WIDTH  = '[Reading Course Draw Letter] Change Line Width',
  CHANGE_LINE_COLOR  = '[Reading Course Draw Letter] Change Line Color',
  TOGGLE_GUIDE_LINES = '[Reading Course Draw Letter] Toggle Guide Lines',
  SHOW_HANDWRITING   = '[Reading Course Draw Letter] Show Handwriting',
  HIDE_HANDWRITING   = '[Reading Course Draw Letter] Hide Handwriting',

  LISTEN_HANDWRITING_MSG = '[Reading Course Draw Letter] Listen Handwriting Message',
  LISTEN_BOARD_MSG = '[Reading Course Draw Letter] Listen Board Message',

  SHOW_SUCCESS_SCREEN = '[Reading Course Draw Letter] Show Success Screen',
  HIDE_SUCCESS_SCREEN = '[Reading Course Draw Letter] Hide Success Screen',
  ON_DONE = '[Reading Course Draw Letter] On Done',
  RESET_DATA = '[Reading Course Draw Letter] Reset Data'
}

export class IsSettingDataDL {
  static readonly type = ReadingCourseDrawLetterActionsType.IS_SETTING_DATA;
  constructor(public payload: { state: boolean }) {}
}

export class SetInitialDataDL {
  static readonly type = ReadingCourseDrawLetterActionsType.SET_INITIAL_DATA;
}

export class SetCurrentDataDL {
  static readonly type = ReadingCourseDrawLetterActionsType.SET_CURRENT_DATA;
}

export class ChangeCurrentDataDL {
  static readonly type = ReadingCourseDrawLetterActionsType.CHANGE_CURRENT_DATA;
}

export class ChangeLineWidthDL {
  static readonly type = ReadingCourseDrawLetterActionsType.CHANGE_LINE_WIDTH;
  constructor( public readonly payload: { lineWidth: number } ) {}
}

export class ChangeLineColorDL {
  static readonly type = ReadingCourseDrawLetterActionsType.CHANGE_LINE_COLOR;
  constructor( public readonly payload: { color: string } ) {}
}

export class ToggleGuideLinesDL {
  static readonly type = ReadingCourseDrawLetterActionsType.TOGGLE_GUIDE_LINES;
}

export class ShowHandwritingDL {
  static readonly type = ReadingCourseDrawLetterActionsType.SHOW_HANDWRITING;
}

export class HideHandwritingDL {
  static readonly type = ReadingCourseDrawLetterActionsType.HIDE_HANDWRITING;
}

export class ListenHandwritingMsgDL {
  static readonly type = ReadingCourseDrawLetterActionsType.LISTEN_HANDWRITING_MSG;
}

export class ShowSuccessScreenDL {
  static readonly type = ReadingCourseDrawLetterActionsType.SHOW_SUCCESS_SCREEN;
}

export class HideSuccessScreenDL {
  static readonly type = ReadingCourseDrawLetterActionsType.HIDE_SUCCESS_SCREEN;
}

export class OnDoneDL {
  static readonly type = ReadingCourseDrawLetterActionsType.ON_DONE;
}

export class ResetDataDL {
  static readonly type = ReadingCourseDrawLetterActionsType.RESET_DATA;
}


export class ListenMsgBoardDL {
  static readonly type = ReadingCourseDrawLetterActionsType.LISTEN_BOARD_MSG;
}
