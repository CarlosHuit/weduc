import { Coordinates } from './coordinates';
import { LearnedLetter } from '../store/models/reading-course/data/reading-course-data.model';

export class InitialData {
  constructor(
    public words:            Words[],
    public letters:          Letters,
    public learnedLetters:   LearnedLetter[],
    public similarLetters?:  SimilarLetters[],
    public coordinates?:     Coordinates[],
  ) {}
}

export class Letters {
  constructor(
    public alphabet:      string,
    public consonants:    string,
    public vocals:        string,
    public combinations:  {any},
    public sound_letters: {any},
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

