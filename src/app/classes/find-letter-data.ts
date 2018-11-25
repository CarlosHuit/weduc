export class FindLetterData {

  constructor(
    public user_id:   string,
    public date:      string,
    public startTime: string,
    public finalTime: string,
    public letter:    string,
    public words:     Options[]
  ) {}

}

export class Options {

  constructor(
    public word:         string,
    public startTime:    string,
    public finalTime:    string,
    public correct:      number,
    public incorrect:    number,
    public pressImage:   string[],
    public instructions: string[],
    public historial:    Selection[],
  ) {}

}



export class Selection {

  constructor(
    public letter:  string,
    public time:    string,
    public status:  boolean,
  ) {}

}

