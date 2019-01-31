export class ReadingCoursePronounceLetterStateModel {
  constructor(
    public data:              PLData[],
    public currentData:       PLData,
    public currentIndex:      number,
    public showSuccessScreen: boolean,
    public isSettingData:     boolean,
    public isRecording:       boolean,
  ) {}
}

export class PLData {
  constructor(
    public letter:   string,
    public type:     string,
    public attempts: number
  ) {}
}
