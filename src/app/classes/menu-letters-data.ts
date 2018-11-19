
export class MenuLettersData {

  constructor(
    public startTime:     string,
    public finalTime:     string,
    public date:          string,
    public user_id:       string,
    public tab_alphabet:  TabAlphabet,
    public tab_learned:   TabLearnedLetters
  ) { }

}




export class TabAlphabet {

  constructor(
    public times:         Times[],
    public lettersHeard:  LettersHeard[],
    public selection?:     string,
  ) { }

}

export class Times {

  constructor (
    public startTime?: string | Date,
    public finalTime?: string | Date
  ) {}

}

export class LettersHeard {

  constructor(
    public letter?: string,
    public time?:   string
  ) { }

}




export class TabLearnedLetters {

  constructor(
    public times:           Times[],
    public sort:            Sort[],
    public previewLetters:  PreviewLetter[],
  ) {}

}

export class Sort {

  constructor(
    public sortBy?: string,
    public time?:   string,
  ) {}

}

export class PreviewLetter {
  constructor(
    public letter?:           string,
    public time?:             Times[],
    public upperCase?:        string[],
    public lowerCase?:        string[],
    public syllables?:        Syllable[],
    public timeRePractice?:   string,
  ) { }
}

export class Syllable {

  constructor(
    public syllable: string,
    public time:     string[],
  ) {}

}
