import { SimilarLetters } from './similar-letters';

export class RandomSimilarLetters {
  constructor(
    public upperCase: string[],
    public lowerCase: string[],
    public u:         SimilarLetters,
    public l:         SimilarLetters,
  ) { }
}

