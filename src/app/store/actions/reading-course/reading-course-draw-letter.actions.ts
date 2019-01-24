export enum ReadingCourseDrawLetterActionsType {
  IS_SETTING_DATA  = '[Reading Course Draw Letter] Is Setting Data',
  SET_INITIAL_DATA = '[Reading Course Draw Letter] Set Initial Data',
  SET_CURRENT_DATA = '[Reading Course Draw Letter] Set Current Data',
  CHANGE_CURRENT_DATA = '[Reading Course Draw Letter] Change Current Data',

  CHANGE_LINE_WIDTH = '[Reading Course Draw Letter] Change Line Width',
  CHANGE_LINE_COLOR = '[Reading Course Draw Letter] Change Line Color',
  TOGGLE_GUIDE_LINES = '[Reading Course Draw Letter] Toggle Guide Lines'
}

export class IsSettingDataDL {
  static readonly type = ReadingCourseDrawLetterActionsType.IS_SETTING_DATA;
  constructor(public payload: { state: boolean }) {}
}

export class SetInitialDataDL {
  static readonly type = ReadingCourseDrawLetterActionsType.SET_INITIAL_DATA;
}

export class SetCurrentDataDL {
  static readonly type = ReadingCourseDrawLetterActionsType.SET_CURRENT_DATA;
}

export class ChangeCurrentDataDL {
  static readonly type = ReadingCourseDrawLetterActionsType.CHANGE_CURRENT_DATA;
}

export class ChangeLineWidthDL {
  static readonly type = ReadingCourseDrawLetterActionsType.CHANGE_LINE_WIDTH;
  constructor( public readonly payload: { lineWidth: number } ) {}
}

export class ChangeLineColorDL {
  static readonly type = ReadingCourseDrawLetterActionsType.CHANGE_LINE_COLOR;
  constructor( public readonly payload: { color: string } ) {}
}

export class ToggleGuideLinesDL {
  static readonly type = ReadingCourseDrawLetterActionsType.TOGGLE_GUIDE_LINES;
}
