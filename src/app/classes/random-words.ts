export class RandomWords {
  constructor(
    public lowerCase: RandomWordsOPtion,
    public upperCase: RandomWordsOPtion,
    public words?:     String[]
  ) {}
}

export class RandomWordsOPtion {
  constructor(
    public corrects:   string[],
    public incorrects: string[],
    public words:      string[],
  ) {}
}
