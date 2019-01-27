export enum ReadingCourseFindLetterActionsType {
  IS_SETTING_DATA       = '[Reading Course Find Letter] Is Setting Data',
  SET_INITIAL_DATA      = '[Reading Course Find Letter] Set Initial Data',
  SET_CURRENT_DATA      = '[Reading Course Find Letter] Set Current Data',
  CHANGE_CURRENTA_DATA  = '[Reading Course Find Letter] Change Current Data',
  SHOW_SUCCESS_SCREEN   = '[Reading Course Find Letter] Show Success Screen',
  HIDE_SUCCESS_SCREEN   = '[Reading Course Find Letter] Hide Success Screen',

  SHOW_CORRECT_LETTERS = '[Reading Course Find Letter] Show Correct Letters',
  HIDE_CORRECT_LETTERS = '[Reading Course Find Letter] Hide Correct Letters',

  SELECT_LETTER_ID    = '[Reading Course Find Letter] Select Letter Id',
  WRONG_SELECTION     = '[Reading Course Find Letter] Wrong Selection',
  CORRECT_SELECTION   = '[Reading Course Find Letter] Correct Selection',
  RESET_DATA          = '[Reading Course Find Letter] Reset Data',
  LISTEN_INSTRUCTIONS = '[Reading Course Find Letter] Listen Instructions',
  LISTEN_WORD = '[Reading Course Find Letter] Listen word',
}

export class IsSettingDataFL {
  static readonly type = ReadingCourseFindLetterActionsType.IS_SETTING_DATA;
  constructor( public payload: { state: boolean } ) {}
}
export class SetInitialDataFL {
  static readonly type = ReadingCourseFindLetterActionsType.SET_INITIAL_DATA;
}
export class SetCurrentDataFL {
  static readonly type = ReadingCourseFindLetterActionsType.SET_CURRENT_DATA;
}
export class ChangeCurrentDataFL {
  static readonly type = ReadingCourseFindLetterActionsType.CHANGE_CURRENTA_DATA;
}
export class ShowSuccessScreenFL {
  static readonly type = ReadingCourseFindLetterActionsType.SHOW_SUCCESS_SCREEN;
}
export class HideSuccessScreenFL {
  static readonly type = ReadingCourseFindLetterActionsType.HIDE_SUCCESS_SCREEN;
}


export class SelectLetterIdFL {
  static readonly type = ReadingCourseFindLetterActionsType.SELECT_LETTER_ID;
  constructor(public readonly payload: { letterId: string }) {}
}

export class WrongSelectionFL {
  static readonly type = ReadingCourseFindLetterActionsType.WRONG_SELECTION;
}

export class CorrectSelectionFL {
  static readonly type = ReadingCourseFindLetterActionsType.CORRECT_SELECTION;
  constructor(public readonly payload: { letterId: string }) {}
}

export class ShowCorrectLettersFL {
  static readonly type = ReadingCourseFindLetterActionsType.SHOW_CORRECT_LETTERS;
}

export class HideCorrectLettersFL {
  static readonly type = ReadingCourseFindLetterActionsType.HIDE_CORRECT_LETTERS;
}

export class ResetDataFL {
  static readonly type = ReadingCourseFindLetterActionsType.RESET_DATA;
}

export class ListenInstructionsFL {
  static readonly type = ReadingCourseFindLetterActionsType.LISTEN_INSTRUCTIONS;
}

export class ListenWordFL {
  static readonly type = ReadingCourseFindLetterActionsType.LISTEN_WORD;
}

