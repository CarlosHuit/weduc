export interface GameData {
  user_id?:     string;
  date?:        string;
  startTime?:   string;
  letter?:      string;
  amount?:      number;
  correct?:     number;
  incorrect?:   number;
  repetitions?: number;
  historial?:   Record[];
  finalTime?:   string;
}

export interface Record {
  letter?:      string;
  time?:        string;
  status?:      boolean;
}
