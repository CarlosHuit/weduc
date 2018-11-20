export class LettersDetailData {

  constructor(
    public user_id:     string,
    public letter:      string,
    public date:        string,
    public startTime:   string,
    public finalTime:   string,
    public cardExample: CardExample,
    public memoryGame:  MemoryGame,
  ) {}

}

export class CardExample {
  constructor(
    public startTime:    string,
    public finalTime:    string,
    public listenLetter: string[],
    public listenMsg:    string[]
  ) {}
}


export class MemoryGame {
  constructor(
    public startTime: string,
    public finalTime: string,
    public pattern:   string[],
    public couples:   Couples[],
    public historial: Historial[]
  ) {}
}

export class Couples {

  constructor(
    public firstLetter:   string,
    public secondLetter:  string,
  ) {}

}

export class Historial {

  constructor(
    public time:   string,
    public letter: string,
    public state:  boolean
  ) {}

}
