import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechSynthesisService       } from '../../services/speech-synthesis.service';
import { Store, Select } from '@ngxs/store';
import { AppState } from 'src/app/store/state/app.state';
import { Observable } from 'rxjs';
import {
  IsSettingDataSW,
  SetInitialDataSW,
  SelectWordSW,
  ListenInstructionsSW
} from 'src/app/store/actions/reading-course/reading-course-select-words.actions';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';



@Component({
  selector: 'app-select-words',
  templateUrl: './select-words.component.html',
  styleUrls: ['./select-words.component.css']
})
export class SelectWordsComponent implements OnInit, OnDestroy {


  @Select( AppState.queryMobileMatch ) queryMobileMatch$: Observable<boolean>;
  @Select( AppState.isMobile )                 isMobile$: Observable<boolean>;

  @Select( ReadingCourseState.swIsSettingData )          isSettingData$: Observable<boolean>;
  @Select( ReadingCourseState.swWords )                          words$: Observable<string[]>;
  @Select( ReadingCourseState.swSelections )                selections$: Observable<{}>;
  @Select( ReadingCourseState.swCorrectSels )              correctSels$: Observable<{}>;
  @Select( ReadingCourseState.swWrongSels )                   wongSels$: Observable<{}>;
  @Select( ReadingCourseState.swAdvance )                      advance$: Observable<number>;
  @Select( ReadingCourseState.swShowSuccessScreen )  showSuccessScreen$: Observable<boolean>;

  constructor( private speech: SpeechSynthesisService, private store: Store) {
    this.store.dispatch( new IsSettingDataSW({state: true}) );
  }

  ngOnInit() {
    this.store.dispatch( new SetInitialDataSW() );
  }

  ngOnDestroy() {
    this.speech.cancel();
  }

  selectWord = (word: string) => this.store.dispatch( new SelectWordSW({ word }) );
  repeatInstructions = () => this.store.dispatch( new ListenInstructionsSW() );

}
