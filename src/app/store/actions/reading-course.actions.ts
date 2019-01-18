import { InitialData } from 'src/app/classes/initial-data';

export enum ReadingCourseActionsType {
  GET_INITIAL_DATA                  = '[Reading Course] Get Initial Data',
  GET_INITIAL_DATA_SUCCESS          = '[Reading Course] Get Initial Data Success',
  IS_LOADING_DATA_OF_READING_COURSE = '[Reading Course] Loading Data Of Reading Course',

  SORT_LEARNED_LETTERS_BY_ALPHABET  = '[Reading Course] Sort Learned Letters By Alphabet',
  SORT_LEARNED_LETTERS_BY_RATING    = '[Reading Course] Sort Learned Letters By Rating',

  LISTEN_MESSAGE             = '[Reading Course Menu] Listen Message',
  CHANGE_SORTER              = '[Reading Course Menu] Change Sorter',
  CHANGE_ACTIVE_TAB          = '[Reading Course Menu] Change Active Tab',
  SELECT_LETTER              = '[Reading Course Menu] Select Letter',
  HIGHLIGHT_LETTER           = '[Reading Course Menu] Highlight Letter',
  ACTIVE_REDIRECTION         = '[Reading Course Menu] Active Redirection',
}

export class GetInitialData {
  static readonly type = ReadingCourseActionsType.GET_INITIAL_DATA;
}

export class GetInitialDataSuccess {
  static readonly type = ReadingCourseActionsType.GET_INITIAL_DATA_SUCCESS;
  constructor(public payload: { data: InitialData}) {}
}

export class IsLoadingDataOfReadingCourse {
  static readonly type = ReadingCourseActionsType.IS_LOADING_DATA_OF_READING_COURSE;
  constructor(  public payload: { state: boolean } ) {}
}

export class SortLearnedLettersByAlphabet {
  static readonly type = ReadingCourseActionsType.SORT_LEARNED_LETTERS_BY_ALPHABET;
}

export class SortLearnedLettersByRating {
  static readonly type = ReadingCourseActionsType.SORT_LEARNED_LETTERS_BY_RATING;
}




/* ---------- Actions menu ---------- */

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

