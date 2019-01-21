export class ReadingCourseLetterDetail {

  constructor(
    public data:           SLData[],
    public currentIndex:          number,
    public currentData:    SLData,
    public selections:     SLSelections,
    public isSettingData:  boolean,
    public showLetterCard: boolean,
    public showAllCards:   boolean,
    public canPlayGame:    boolean,
    public showSuccessScreen: boolean
  ) {}

}

export class SLData {
  constructor(
    public letter: string,
    public data:   string[],
    public type:   string
  ) {}
}

export class SLSelections {
  constructor(
    public selection1: string,
    public selection2: string
  ) {}
}
