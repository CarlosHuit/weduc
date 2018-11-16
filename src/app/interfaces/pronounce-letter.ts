export interface PronounceLetter {
  user_id?:   string;
  startTime?: string;
  finalTime?: string;
  date?:      string;
  letter?:    string;
  countHelp?: string[];
  historial?: Historial[];
}

export interface Historial {

  startRecord: string;
  finalRecord: string;
  sentence:    string;
  state:       boolean;

}
