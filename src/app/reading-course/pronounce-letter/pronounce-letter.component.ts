import { Component, OnInit, OnDestroy   } from '@angular/core';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { Store, Select } from '@ngxs/store';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { Observable, Subscription } from 'rxjs';
import {
  IsSettingDataPL,
  SetInitialDataPL,
  ListenHelpPL,
  StartRecordingPL
} from 'src/app/store/actions/reading-course/reading-course-pronounce-letter';
import { AppState } from 'src/app/store/state/app.state';


@Component({
  selector: 'app-pronounce-letter',
  templateUrl: './pronounce-letter.component.html',
  styleUrls: ['./pronounce-letter.component.css']
})
export class PronounceLetterComponent implements OnInit, OnDestroy {

  @Select( ReadingCourseState.plIsSettingData )         isSettingData$: Observable<boolean>;
  @Select( ReadingCourseState.plCurrentLetter )         currentLetter$: Observable<string>;
  @Select( ReadingCourseState.plIsRecording )             isRecording$: Observable<boolean>;
  @Select( ReadingCourseState.plShowBtnHelp )             showBtnHelp$: Observable<boolean>;
  @Select( ReadingCourseState.plShowSuccessScreen ) showSuccessScreen$: Observable<boolean>;
  @Select( AppState.isMobile )                               isMobile$: Observable<boolean>;
  @Select( AppState.queryMobileMatch )               queryMobileMatch$: Observable<boolean>;

  animate = false;
  canGetHelp = false;
  sub1: Subscription;

  constructor( private _synthesis:   SpeechSynthesisService, private store: Store ) {

    this.store.dispatch( new IsSettingDataPL({state: true}) );

  }

  ngOnInit() {
    this.store.dispatch( new SetInitialDataPL() );
    this.sub1 =  this.showBtnHelp$.subscribe(s => this.canGetHelp = s);
  }

  ngOnDestroy() {
    this._synthesis.cancel();
    this.sub1.unsubscribe();
  }

  help() {

    if (this.canGetHelp) {
      this.store.dispatch( new ListenHelpPL() );
    }

  }



  speak() {
    this.store.dispatch( new StartRecordingPL() );
  }


  genFontSize(el: HTMLElement) {
    return el.clientWidth * 0.56;
  }

}

