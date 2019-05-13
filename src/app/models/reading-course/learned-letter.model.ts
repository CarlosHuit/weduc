import { Combination } from './letters.model';

export class LearnedLetter {

  constructor(
    public letter: string,
    public rating: number,
    public combinations?: Combination[]
  ) { }

}
