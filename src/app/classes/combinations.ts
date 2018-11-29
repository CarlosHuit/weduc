export class Combinations {
  constructor(
    public letter:       string,
    public combinations: Options[]
  ) { }
}


export class Options {
  constructor(
    public word:        string,
    public combination: string,
    public syllables:   string[],
    public syllable:    SyllableDetail,
    public color?:      string,

  ) {}
}

export class SyllableDetail {
  constructor(
    public w: string,
    public p: string,
  ) {}
}
