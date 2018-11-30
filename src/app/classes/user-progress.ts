import { LearnedLetters } from './learned-letters';

export class UserProgress {
  constructor(
    public _id: string,
    public learnedLetters: LearnedLetters[]
  ) {}
}
