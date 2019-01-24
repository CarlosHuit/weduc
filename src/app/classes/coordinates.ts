export class Coordinates {
  constructor(
    public coordinates: Coordinate[][],
    public letter:      string,
  ) {}
}


export class Coordinate {
  constructor(
    public x: number,
    public y: number,
  ) {}
}
