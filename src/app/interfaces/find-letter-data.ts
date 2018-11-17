export interface FindLetterData {
  user_id?:     string;
  date?:        string;
  startTime?:   string;
  finalTime?:   string;
  pressLetter?: string[];
  letter?:      string;
  pattern?:     string[];
  fails?:       number;
  couples?:     string[][];
  historial?:   Selection[];
}

export interface Selection {
  time?:   string;
  letter?: string;
  state?:  boolean;
}
