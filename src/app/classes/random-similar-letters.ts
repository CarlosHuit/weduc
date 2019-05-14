import { SimilarLetter } from '../models/reading-course/similar-letter.model';

export class RandomSimilarLetters {
  constructor(
    public upperCase: string[],
    public lowerCase: string[],
    public u:         SimilarLetter,
    public l:         SimilarLetter,
  ) { }
}

