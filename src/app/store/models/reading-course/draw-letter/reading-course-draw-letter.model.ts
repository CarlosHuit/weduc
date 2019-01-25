import { Coordinates, Coordinate } from 'src/app/classes/coordinates';

export class ReadingCourseDrawLetterModel {

  constructor(
    public data:              DrawLetterData[],
    public currentData:       DrawLetterData,
    public currentIndex:      number,
    public isSettingData:     boolean,
    public showSuccessScreen: boolean,
    public showBoard:         boolean,
    public showHandwriting:   boolean,
    public preferences:       Preferences,
    public configData:        ConfigData,
  ) {}

}

export class DrawLetterData {
  constructor(
    public coordinates: Coordinate[][],
    public letter:      string,
    public type:        string
  ) {}
}

export class Preferences {
  constructor(
    public lineWidth:      number,
    public lineColor:      string,
    public showGuideLines: boolean,
    public styleLine:      CanvasLineCap,
  ) {}
}

export class ConfigData {
  constructor(
    public colors:      string[],
    public lineWidth:   {
      min:      number,
      max:      number,
      width:    number,
      step:     number
    },
  ) {}
}

