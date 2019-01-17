import { LearnedLetters } from 'src/app/classes/learned-letters';
import { Coordinates } from 'src/app/classes/coordinates';

export class ReadingCourseDataModel {
  constructor(
    public words?:            Words[],
    public letters?:          Letters,
    public learnedLetters?:   LearnedLetters[],
    public isLoadingDataOfReadingCourse?: boolean,
    public lettersMenu?:      { letter: string, imgUrl: string }[],
    public combinations?:     any,
    public letterSounds?:     {any},
    public similarLetters?:   SimilarLetters[],
    public coordinates?:      Coordinates[],
  ) {}
}

export class ReadingCourseModel {
  constructor(
    public data: ReadingCourseDataModel,
    public menu: ReadingCourseMenu
  ) {}
}

export class ReadingCourseMenu {
  constructor(
    public sortedBy  =        'alphabet' || 'rating',
    public activeTab =        'alphabet' || 'learneds',
    public selectedLetter:    string,
    public activeRedirection: boolean,
    public highlight:         { letter: string, type: string },
  ) {}
}

export class Letters {
  constructor(
    public alphabet:      string,
    public consonants:    string,
    public vocals:        string,
    public combinations:  {any: any},
    public sound_letters: {any: any},
  ) {}
}

export class Words {
  constructor(
    public l: string,
    public w: string[],
  ) {}
}

export class SimilarLetters {
  constructor(
    public l: string,
    public m: string,
  ) {}
}

