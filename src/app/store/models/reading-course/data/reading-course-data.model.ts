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
    public letterSounds?:     {},
    public similarLetters?:   SimilarLetters[],
    public coordinates?:      Coordinates[],
    public currentLetter?:    string
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
    public sl: string,
  ) {}
}
