export enum ReadingCourseLetterDetailActionsType {

  SET_INITIAL_DATA = '[Reading Course Letter Detail] Set Initial Data',
  SET_CURRENT_DATA = '[Reading Course Letter Detail] Set Current Data',
  IS_SETTING_DATA  = '[Reading Course Letter Detail] Is Setting Data',
  SHOW_LETTER_CARD = '[Reading Course Letter Detail] Show Letter Card',
  HIDE_LETTER_CARD = '[Reading Course Letter Detail] Hide Letter Card',
  SHOW_ALL_CARDS   = '[Reading Course Letter Detail] Show All Cards',
  HIDE_ALL_CARDS   = '[Reading Course Letter Detail] Hide All Cards',
  SELECT_LETTER    = '[Reading Course Letter Detail] Select Letter',
  ADD_FIRST_SELECTION    = '[Reading Course Letter Detail] Add First Selection',
  ADD_SECOND_SELECTION   = '[Reading Course Letter Detail] Add Second Selection',
  VALIDATE_SELECTIONS    = '[Reading Course Letter Detail] Validate Selections',
  LETTERS_ARE_SAME       = '[Reading Course Letter Detail] Letters Are Same',
  LETTERS_ARE_NOT_SAME   = '[Reading Course Letter Detail] Letters Are Not Same',
  SHOW_SUCCESS_SCREEN    = '[Reading Course Letter Detail] Show Success Screen',
  HIDE_SUCCESS_SCREEN    = '[Reading Course Letter Detail] Hide Success Screen',
  RESET_DATA             = '[Reading Course Letter Detail] Reset Letter Detail Data',
  LISTEN_LETTER_PRESENTATION = '[Reading Course Letter Detail] Listen Letter Presentation',
}


export class SetInitialDataLD {

  static readonly type = ReadingCourseLetterDetailActionsType.SET_INITIAL_DATA;

}


export class SetCurrentData {

  static readonly type = ReadingCourseLetterDetailActionsType.SET_CURRENT_DATA;

}


export class IsSettingDataLD {

  static readonly type = ReadingCourseLetterDetailActionsType.IS_SETTING_DATA;
  constructor( public payload: { state: boolean } ) {}

}


export class ShowLetterCardLD {

  static readonly type = ReadingCourseLetterDetailActionsType.SHOW_LETTER_CARD;

}


export class ListenLetterPresentationLD {

  static readonly type = ReadingCourseLetterDetailActionsType.LISTEN_LETTER_PRESENTATION;

}


export class HideLetterCardLD {

  static readonly type = ReadingCourseLetterDetailActionsType.HIDE_LETTER_CARD;
  constructor(public payload: {listenMsg: boolean}) {}

}


export class ShowAllCardsLD {

  static readonly type = ReadingCourseLetterDetailActionsType.SHOW_ALL_CARDS;

}


export class HideAllCardsLD {

  static readonly type = ReadingCourseLetterDetailActionsType.HIDE_ALL_CARDS;

}


export class SelectLetterLD {

  static readonly type = ReadingCourseLetterDetailActionsType.SELECT_LETTER;
  constructor(public payload: { letterId: string }) {}

}


export class AddFirstSelectionLD {

  static readonly type = ReadingCourseLetterDetailActionsType.ADD_FIRST_SELECTION;
  constructor(public payload: { letterId: string, isCorrect: boolean }) {}

}


export class AddSecondSelectionLD {

  static readonly type = ReadingCourseLetterDetailActionsType.ADD_SECOND_SELECTION;
  constructor(public payload: { letterId: string, isCorrect: boolean }) {}

}


export class ValidateSelectionsLD {

  static readonly type = ReadingCourseLetterDetailActionsType.VALIDATE_SELECTIONS;

}


export class LettersAreSameLD {

  static readonly type = ReadingCourseLetterDetailActionsType.LETTERS_ARE_SAME;

}


export class LettersAreNotSameLD {

  static readonly type = ReadingCourseLetterDetailActionsType.LETTERS_ARE_NOT_SAME;

}


export class ShowSuccessScreenLD {

  static readonly type = ReadingCourseLetterDetailActionsType.SHOW_SUCCESS_SCREEN;

}


export class HideSuccessScreenLD {

  static readonly type = ReadingCourseLetterDetailActionsType.HIDE_SUCCESS_SCREEN;

}


export class ResetLetterDetailData {

  static readonly type = ReadingCourseLetterDetailActionsType.RESET_DATA;

}


