export class PronounceLetterData {
  constructor(
    public user_id?:   string,
    public startTime?: string,
    public finalTime?: string,
    public date?:      string,
    public letter?:    string,
    public countHelp?: string[],
    public historial?: Historial[],
  ) {}
}


export class Historial {
  constructor(
    public startRecord: string,
    public finalRecord: string,
    public sentence:    string,
    public state:       boolean,
  ) {}

}
