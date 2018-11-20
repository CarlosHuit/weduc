export class GameData {

  constructor(
    public user_id:     string,
    public date:        string,
    public startTime:   string,
    public finalTime:   string,
    public letter:      string,
    public amount:      number,
    public correct:     number,
    public incorrect:   number,
    public repetitions: string[],
    public historial:   History[]
  ) {}

}

export class History {

  constructor(
    public letter?:      string,
    public time?:        string,
    public status?:      boolean,

  ) {}

}
