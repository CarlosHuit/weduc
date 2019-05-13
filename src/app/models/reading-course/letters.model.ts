export class Letters {

  constructor(
    public readonly vocals: string,
    public readonly alphabet: string,
    public readonly consonants: string,
    public readonly letterSounds: LetterSound[],
    public readonly combinations: AlphabetCombination[],
  ) {}

}

export class Combination {

  constructor(
    public readonly w: string,
    public readonly p: string,
  ) {}

}

export class AlphabetCombination {

  constructor(
    public readonly letter: string,
    public readonly combinations: Combination[],
  ) {}

}

export class LetterSound {

  constructor(
    public readonly letter: string,
    public readonly sound: string,
  ) {}

}
