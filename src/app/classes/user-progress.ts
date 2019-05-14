import { LearnedLetter } from '../models/reading-course/learned-letter.model';

export class UserProgress {
  constructor(
    public _id: string,
    public learnedLetters: LearnedLetter[]
  ) {}
}
