
export class MenuLettersData {

  constructor(
    public startTime:     string,
    public finalTime:     string,
    public date:          string,
    public user_id:       string,
    public tab_alphabet:  TabAlphabet[],
    public tab_learned:   LearnedLetters[]
  ) { }

}





export class TabAlphabet {

  constructor(
    public startTime:     string,
    public finalTime:     string,
    public lettersHeard:  LettersHeard[]
  ) { }

}

export class LettersHeard {

  constructor(
    public letter: string,
    public time:   string
  ) { }

}




export class LearnedLetters {

  constructor(
    public startTime:       string,
    public finalTime:       string,
    public sortAlphabet:    string[],
    public sortRating:      string[],
    public previewLetters:  PreviewLetters[]
  ) {}

}

export class PreviewLetters {
  constructor(
    public letter:          string,
    public timeOpen:        string,
    public timeClose:       string,
    public upperCase:       string[],
    public lowerCase:        string[],
    public syllables:       Syllables[],
    public timeRePractice:  string,
  ) { }
}

export class Syllables {

  constructor(
    public syllable: string,
    public time:     string,
  ) {}

}
