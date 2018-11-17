export interface Combinations {
  letter: string;
  combinations: Options[];
}

export interface Options {
  word:        string;
  combination: string;
  syllables:   string[];
  syllable:    SyllableDetail;
  color?:      string;
}

export interface SyllableDetail {
  w: string;
  p: string;
}
