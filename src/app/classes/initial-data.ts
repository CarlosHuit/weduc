import { Coordinates } from './coordinates';
import { LearnedLetters } from './learned-letters';

export class InitialData {
  constructor(
    public words:           Words[],
    public letters:         Letters,
    public similarLetters:  SimilarLetters[],
    public learnedLetters:  LearnedLetters[],
    public coordinates:     Coordinates[],
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
    public m: string,
  ) {}
}
