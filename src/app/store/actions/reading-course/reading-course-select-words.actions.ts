export enum ReadingCourseSelectWordsActionsType {

  IS_SETTING_DATA     = '[Reading Course Select Words] Is Setting Data',
  SHOW_SUCCESS_SCREEN = '[Reading Course Select Words] Show Success Screen',
  HIDE_SUCCESS_SCREEN = '[Reading Course Select Words] Hide Success Screen',
  SET_INITIAL_DATA    = '[Reading Course Select Words] Set Initial Data',
  SET_CURRENT_DATA    = '[Reading Course Select Words] Set Current Data',
  CHANGE_CURRENT_DATA = '[Reading Course Select Words] Change Current Data',

  SELECT_WORD         = '[Reading Course Select Words] Select Word',
  REGISTER_SELECTION         = '[Reading Course Select Words] Register Selection',
  REGISTER_WRONG_SELECTION   = '[Reading Course Select Words] Register Wrong Selection',
  REGISTER_CORRECT_SELECTION = '[Reading Course Select Words] Register Correct Selection',


  RESET_DATA = '[Reading Course Select Words] Reset Data',
  LISTEN_INSTRUCTIONS = '[Reading Course Select Words] Listen Instructions',

}


export class IsSettingDataSW {

  static readonly type = ReadingCourseSelectWordsActionsType.IS_SETTING_DATA;
  constructor( public readonly payload: { state: boolean } ) {}

}


export class ShowSuccessScreenSW {

  static readonly type = ReadingCourseSelectWordsActionsType.SHOW_SUCCESS_SCREEN;

}


export class HideSuccessScreenSW {

  static readonly type = ReadingCourseSelectWordsActionsType.HIDE_SUCCESS_SCREEN;

}


export class SetInitialDataSW {

  static readonly type = ReadingCourseSelectWordsActionsType.SET_INITIAL_DATA;

}


export class SetCurrentDataSW {

  static readonly type = ReadingCourseSelectWordsActionsType.SET_CURRENT_DATA;

}


export class ChangeCurrentDataSW {

  static readonly type = ReadingCourseSelectWordsActionsType.CHANGE_CURRENT_DATA;

}


export class SelectWordSW {

  static readonly type = ReadingCourseSelectWordsActionsType.SELECT_WORD;
  constructor( public readonly payload: { word: string } ) {}

}


export class RegisterSelectionSW {

  static readonly type = ReadingCourseSelectWordsActionsType.REGISTER_SELECTION;
  constructor( public readonly payload: { word: string } ) {}

}


export class RegisterWrongSelectionSW {

  static readonly type = ReadingCourseSelectWordsActionsType.REGISTER_WRONG_SELECTION;
  constructor( public readonly payload: { word: string } ) {}

}


export class RegisterCorrectSelectionSW {

  static readonly type = ReadingCourseSelectWordsActionsType.REGISTER_CORRECT_SELECTION;
  constructor( public readonly payload: { word: string } ) {}

}


export class ResetDataSW {

  static readonly type = ReadingCourseSelectWordsActionsType.RESET_DATA;

}


export class ListenInstructionsSW {

  static readonly type = ReadingCourseSelectWordsActionsType.LISTEN_INSTRUCTIONS;

}
