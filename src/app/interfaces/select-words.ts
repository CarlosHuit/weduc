export interface SelectWords {
  user_id?:    string;
  startTime?:  string;
  finishTime?: string;
  replays?:    string[];
  date?:       string;
  letter?:     string;
  amount?:     number;
  corrects?:   number;
  incorrects?: number;
  pattern?:    string[];
  historial?:  Historial[];
}


export interface Historial {
  time:  string;
  word:  string;
  state: boolean;
}
