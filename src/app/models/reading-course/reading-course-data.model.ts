import { Word } from './word.model';
import { Letters } from './letters.model';
import { Coordinate } from './coordinate.model';
import { LearnedLetter } from './learned-letter.model';
import { SimilarLetter } from './similar-letter.model';

export class ReadingCourseData {

  constructor(
    public readonly          words: Word[],
    public readonly        letters: Letters,
    public readonly    coordinates: Coordinate[],
    public readonly learnedLetters: LearnedLetter[],
    public readonly similarLetters: SimilarLetter[],
  ) { }

}
