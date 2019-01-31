import { Coordinates } from 'src/app/classes/coordinates';

export class ReadingCourseDataModel {
  constructor(
    public words?:                        Words[],
    public letters?:                      Letters,
    public learnedLetters?:               LearnedLetter[],
    public isLoadingDataOfReadingCourse?: boolean,
    public lettersMenu?:                  ItemLetterMenu[],
    public combinations?:                 any,
    public letterSounds?:                 {},
    public similarLetters?:               SimilarLetters[],
    public coordinates?:                  Coordinates[],
    public currentLetter?:                string,
  ) {}
}

export class ItemLetterMenu {
  constructor(
    public letterLowerCase: string,
    public letterUpperCase: string,
    public letter:          string,
    public word:            string,
    public imgUrl:          string,
  ) {}
}

export class Letters {
  constructor(
    public alphabet:      string,
    public consonants:    string,
    public vocals:        string,
    public combinations:  any,
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
    public sl: string[],
  ) {}
}

export class LearnedLetter {

  constructor(
    public letter:        string,
    public rating:        number,
    public combinations?: { p: string, w: string}[]
  ) {}

}
