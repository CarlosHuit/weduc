import { InitialData } from 'src/app/classes/initial-data';

export enum ReadingCourseActionsType {
  GET_INITIAL_DATA                  = '[Reading Course Data] Get Initial Data',
  GET_INITIAL_DATA_SUCCESS          = '[Reading Course Data] Get Initial Data Success',
  IS_LOADING_DATA_OF_READING_COURSE = '[Reading Course Data] Loading Data Of Reading Course',
  SORT_LEARNED_LETTERS_BY_ALPHABET  = '[Reading Course Data] Sort Learned Letters By Alphabet',
  SORT_LEARNED_LETTERS_BY_RATING    = '[Reading Course Data] Sort Learned Letters By Rating',

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


