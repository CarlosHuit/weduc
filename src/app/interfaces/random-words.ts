export interface RandomWords {
  lowerCase: RandomWordsOPtion;
  upperCase: RandomWordsOPtion;
}

export interface RandomWordsOPtion {
  corrects?:   string[];
  incorrects?: string[];
  words?:      string[];
}
