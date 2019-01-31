import { Component, OnInit, OnDestroy   } from '@angular/core';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { Store, Select } from '@ngxs/store';
import {
  IsSettingDataPL,
  SetInitialDataPL,
  ListenHelpPL,
} from 'src/app/store/actions/reading-course/reading-course-pronounce-letter';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-pronounce-letter',
  templateUrl: './pronounce-letter.component.html',
  styleUrls: ['./pronounce-letter.component.css']
})
export class PronounceLetterComponent implements OnInit, OnDestroy {



  loading:  Boolean;
  success:  Boolean;
  letterSounds: any;

  @Select( ReadingCourseState.plIsSettingData ) isSettingData$: Observable<boolean>;
  @Select( ReadingCourseState.plCurrentLetter ) currentLetter$: Observable<string>;
  @Select( ReadingCourseState.plIsRecording )     isRecording$: Observable<boolean>;
  @Select( ReadingCourseState.plShowBtnHelp )     showBtnHelp$: Observable<boolean>;
  @Select( ReadingCourseState.plShowSuccessScreen ) showSuccessScreen$: Observable<boolean>;


  constructor(
    private _synthesis:   SpeechSynthesisService,
    private store: Store
  ) {
    this.store.dispatch( new IsSettingDataPL({state: true}) );
  }


  ngOnInit() {
    this.store.dispatch( new SetInitialDataPL() );
  }


  ngOnDestroy() {
    this._synthesis.cancel();
  }



  help = () => this.store.dispatch( new ListenHelpPL() );




}

