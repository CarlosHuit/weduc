export class DrawLettersData {

  constructor(
    public user_id:     string,
    public startTime:   string,
    public finalTime:   string,
    public date:        string,
    public letter:      string,
    public handWriting: string[],
    public board:       Board[]
  ) { }

}

export class HandWritingTimes {
  constructor(
    public time:     string,
    public complete: boolean,
  ) {}
}

export class Board {

  constructor(
    public coordinates: Coordinates[][],
    public sizeCanvas:  SizeCanvas,
    public timeClear:   string,
  ) { }

}

export class Coordinates {

  constructor(
    public x: number,
    public y: number
  ) {}

}

export class SizeCanvas {

  constructor(
    public width:  number,
    public height: number
  ) {}

}
