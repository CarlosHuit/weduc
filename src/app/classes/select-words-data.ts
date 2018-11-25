export class SelectWordsData {
  constructor(
    public user_id:    string,
    public startTime:  string,
    public finishTime: string,
    public replays:    string[],
    public date:       string,
    public letter:     string,
    public amount:     number,
    public corrects:   number,
    public incorrects: number,
    public pattern:    string[],
    public historial:  Historial[],
  ) {}
}

export class Historial {
  constructor(
    public time:  string,
    public word:  string,
    public state: boolean,
  ) {}
}

