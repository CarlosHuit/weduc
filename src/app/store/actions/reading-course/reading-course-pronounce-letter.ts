
export enum ReadingCoursePronounceLetterActionsType {

  IS_SETTING_DATA     = '[Reading Course Pronounce Letter] Is Setting Data',
  SET_INITIAL_DATA    = '[Reading Course Pronounce Letter] Set Initial Data',
  SET_CURRENT_DATA    = '[Reading Course Pronounce Letter] Set Current Data',
  CHANGE_CURRENT_DATA = '[Reading Course Pronounce Letter] Change Current Data',

  SHOW_SUCCESS_SCREEN = '[Reading Course Pronounce Letter] Show Success Screen',
  HIDE_SUCCESS_SCREEN = '[Reading Course Pronounce Letter] Hide Success Screen',

  RESET_DATA          = '[Reading Course Pronounce Letter] Reset Data',
  LISTEN_INSTRUCTIONS = '[Reading Course Pronounce Letter] Listen Instructions',
  LISTEN_HELP         = '[Reading Course Pronounce Letter] Listen Help',
  LISTEN_MSG_WRONG    = '[Reading Course Pronounce Letter] Listen Msg Wrong',
  LISTEN_MSG_NO_SPEECH = '[Reading Course Pronounce Letter] Listen Msg No Speech',

  START_RECORDING    = '[Reading Course Pronounce Letter] Start Recording',
  HANDLE_RECOGNITION_RESULT   = '[Reading Course Pronounce Letter] Handle Recognition Result',
  HANDLE_RECOGNITION_ERROR    = '[Reading Course Pronounce Letter] Handle Recognition Error',
  HANDLE_RECOGNITION_COMPLETE = '[Reading Course Pronounce Letter] Handle Recognition Complete',

  CHANGE_STATE_RECORDING = '[Reading Course Pronounce Letter] Change State Recording',
  INCREASE_ATTEMPTS = '[Reading Course Pronounce Letter] Increase Attempts',
  CORRECT_PRONUNCIATION = '[Reading Course Pronounce Letter] Correct Pronunciation'

}


export class IsSettingDataPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.IS_SETTING_DATA;
  constructor( public readonly payload: { state: boolean } ) {}

}


export class SetInitialDataPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.SET_INITIAL_DATA;

}


export class SetCurrentDataPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.SET_CURRENT_DATA;

}


export class ChangeCurrentDataPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.CHANGE_CURRENT_DATA;

}


export class ShowSuccessScreenPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.SHOW_SUCCESS_SCREEN;

}


export class HideSuccessScreenPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.HIDE_SUCCESS_SCREEN;

}


export class ResetDataPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.RESET_DATA;

}


export class ListenInstructionsPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.LISTEN_INSTRUCTIONS;

}


export class ListenHelpPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.LISTEN_HELP;

}


export class ListenMsgWrongPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.LISTEN_MSG_WRONG;

}


export class ListenMsgNoSpeechPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.LISTEN_MSG_NO_SPEECH;

}


export class StartRecordingPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.START_RECORDING;

}


export class HandleRecognitionCompletePL {

  static readonly type = ReadingCoursePronounceLetterActionsType.HANDLE_RECOGNITION_COMPLETE;

}


export class HandleRecognitionErrorPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.HANDLE_RECOGNITION_ERROR;
  constructor( public readonly payload: { err: SpeechRecognitionError } ) {}

}


export class HandleRecognitionResultPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.HANDLE_RECOGNITION_RESULT;
  constructor(public readonly payload: { res: string }) {}

}


export class ChangeStateRecordingPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.CHANGE_STATE_RECORDING;
  constructor( public readonly payload: { state: boolean } ) {}

}


export class IncreaseAttemptsPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.INCREASE_ATTEMPTS;

}


export class CorrectPronunciationPL {

  static readonly type = ReadingCoursePronounceLetterActionsType.CORRECT_PRONUNCIATION;

}
