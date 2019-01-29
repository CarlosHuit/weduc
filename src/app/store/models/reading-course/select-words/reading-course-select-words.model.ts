export class ReadingCourseSelectWordsModel {

  constructor(
    public data:              SWData[],
    public currentData:       SWData,
    public isSettingData:     boolean,
    public showSuccessScreen: boolean,
    public currentIndex:      number,
    public disableAll:        number
  ) {}

}

export class SWData {

  constructor(
    public words:              string[],
    public correctWords:       string[],
    public incorrectWords:     string[],
    public letter:             string,
    public type:               string,
    public totalOfCorrect:     number,
    public totalOfPending:      number,
    public selections:         {},
    public correctSelections:  {},
    public wrongSelections:    {}
  ) {}

}
