interface FindLetter {
  user_id?:     string;
  date?:        string;
  startTime?:   string;
  finalTime?:   string;
  letter?:      string;
  words?:       Options[];
}

interface Options {
  word?:        string;
  startTime?:   string;
  finalTime?:   string;
  correct?:     number;
  incorrect?:   number;
  pressImage:   number;
  repetitions:  number;
  historial?:   Selection[];
}

interface Selection {
  letter?:  string;
  time?:    string;
  status?:  boolean;
}

