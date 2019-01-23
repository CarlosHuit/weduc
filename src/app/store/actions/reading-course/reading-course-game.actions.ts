export enum ReadingCourseGameActionsType {
  IS_SETTING_DATA    = '[Reading Course Game] Is Setting Data',
  SET_INITIAL_DATA   = '[Reading Course Game] Set Initial Data',
  SET_CURRENT_DATA   = '[Reading Course Game] Set Current Data',
  RESTART_DATA       = '[Reading Course Game] Restart Data',
  SELECT_LETTER      = '[Reading Course Game] Select Letter',
  REGISTER_LETTER_ID = '[Reading Course Game] Register Letter Id',

  INCREASE_CORRECTS      = '[Reading Course Game] Increase Corrects',
  INCREASE_INCORRECTS    = '[Reading Course Game] Increase Incorrects',
  LISTEN_INITIAL_MSG     = '[Reading Course Game] Listen Initial Message',
  SHOW_CORRECTS_LETTERS  = '[Reading Course Game] Show Correct Letters',
  SHOW_SUCCESS_SCREEN    = '[Reading Course Game] Show Success Screen',
  HIDE_SUCCESS_SCREEN    = '[Reading Course Game] Hide Success Screen',
  CHANGE_CURRENT_DATA    = '[Reading Course Game] Change Current Data',
  USE_HELP               = '[Reading Course Game] Use Help',
  RESET_DATA             = '[Reading Course Game] Reset Data',
}


export class IsSettingDataG {
  static readonly type = ReadingCourseGameActionsType.IS_SETTING_DATA;
  constructor( public payload: { state: boolean } ) {}
}
export class SetInitialDataG {
  static readonly type = ReadingCourseGameActionsType.SET_INITIAL_DATA;
  constructor( public payload: { containerWidth: number } ) {}
}

export class SetCurrentDataG {
  static readonly type = ReadingCourseGameActionsType.SET_CURRENT_DATA;
}

export class RestartDataG {
  static readonly type = ReadingCourseGameActionsType.RESTART_DATA;
  constructor( public readonly payload: { containerWidth: number } ) {}
}

export class SelectLetterG {
  static readonly type = ReadingCourseGameActionsType.SELECT_LETTER;
  constructor( public readonly payload: { letterId: string } ) {}
}

export class RegisterLetterIdG {
  static readonly type = ReadingCourseGameActionsType.REGISTER_LETTER_ID;
  constructor( public payload: { letterId: string } ) {}
}

export class IncreaseCorrectsG {
  static readonly type = ReadingCourseGameActionsType.INCREASE_CORRECTS;
}

export class IncreaseIncorrectsG {
  static readonly type = ReadingCourseGameActionsType.INCREASE_INCORRECTS;
}

export class ListenInitialMsgG {
  static readonly type = ReadingCourseGameActionsType.LISTEN_INITIAL_MSG;
}

export class ShowCorrectLettersG {
  static readonly type = ReadingCourseGameActionsType.SHOW_CORRECTS_LETTERS;
  constructor( public payload: {state: boolean  } ) {}
}

export class ShowSuccessScreenG {
  static readonly type = ReadingCourseGameActionsType.SHOW_SUCCESS_SCREEN;
}

export class HideSuccessScreenG {
  static readonly type = ReadingCourseGameActionsType.HIDE_SUCCESS_SCREEN;
}

export class ChangeCurrentDataG {
  static readonly type = ReadingCourseGameActionsType.CHANGE_CURRENT_DATA;
}

export class ResetDataG {
  static readonly type = ReadingCourseGameActionsType.RESET_DATA;
}

export class UseHelpG {
  static readonly type = ReadingCourseGameActionsType.USE_HELP;
}
