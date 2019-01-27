export class ReadingCourseFindLetterModel {

  constructor(
    public data:              FLData[],
    public currentData:       FLData,
    public currentIndex:      number,
    public isSettingData:     boolean,
    public showSuccessScreen: boolean,
    public showCoincidences:  boolean,
  ) {}

}

export class FLData {

  constructor(
    public word:      string,
    public imgUrl:     string,
    public letter:     string,
    public type:       string,
    public corrects:   number,
    public letterIds:  string[],
    public selections: {}
  ) {}

}
