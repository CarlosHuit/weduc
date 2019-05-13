export class Coordinate {

  constructor(
    public readonly letter: string,
    public readonly coordinates: PositionXY[][],
  ) {}

}

export class PositionXY {

  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

}
