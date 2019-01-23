export class ReadingCourseGameStateModel {

  constructor(
    public isSettingData:     boolean,
    public data:              GData[],
    public currentIndex:      number,
    public currentData:       GData,
    public showSuccessScreen: boolean,
    public showCoincidences:  boolean,
    public selections:        {},
    public showCorrectLetters: boolean,
  ) {}

}

export class GData {

  constructor(
    public letter:             string,
    public data:               any[][],
    public type:               string,
    public correctsValidation: number,
    public totalCorrects:      number,
    public countCorrects:      number,
    public countIncorrects:    number,
    public opportunities:      number
  ) {}

}

