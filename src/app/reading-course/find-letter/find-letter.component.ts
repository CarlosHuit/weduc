import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechSynthesisService       } from '../../services/speech-synthesis.service';
import { Store, Select } from '@ngxs/store';
import { AppState } from 'src/app/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import {
  IsSettingDataFL,
  SetInitialDataFL,
  SelectLetterIdFL,
  ListenInstructionsFL,
  ListenWordFL
} from 'src/app/store/actions/reading-course/reading-course-find-letter.actions';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { FLData } from 'src/app/store/models/reading-course/find-letter/reading-course-find-letter.model';


@Component({
  selector: 'app-find-letter',
  templateUrl: './find-letter.component.html',
  styleUrls: ['./find-letter.component.css']
})


export class FindLetterComponent implements OnDestroy, OnInit {

  sub1: Subscription;

  @Select(AppState.isMobile)           isMobile$:          Observable<boolean>;
  @Select(ReadingCourseState.flData)    fldata$:            Observable<FLData[]>;
  @Select(AppState.queryMobileMatch)     queryMobileMatch$:  Observable<boolean>;
  @Select(ReadingCourseState.flAdvance)   advance$:           Observable<number>;
  @Select(ReadingCourseState.flDisableAll) disableAll$:        Observable<boolean>;
  @Select(ReadingCourseState.flSelections)  selections$:        Observable<{}>;
  @Select(ReadingCourseState.flcurrentIndex)  index$:             Observable<number>;
  @Select(ReadingCourseState.flIsSettingData)  isSettingData$:     Observable<boolean>;
  @Select(ReadingCourseState.flDataLength)      dataLength$:        Observable<number>;
  @Select(ReadingCourseState.flWrongSelections)  wrongSels$:         Observable<{}>;
  @Select(ReadingCourseState.flCorrectSelections) correctsSels$:      Observable<{}>;
  @Select(ReadingCourseState.flShowSuccessScreen)  showSuccessScreen$: Observable<boolean>;

  dataLength: number;
  isMobile: boolean;
  word:   string;

  position = 0;

  sub2: Subscription;
  sub3: Subscription;

  constructor( private _speech: SpeechSynthesisService, private store: Store ) {

    this.store.dispatch( new IsSettingDataFL({state: true}) );

  }

  ngOnInit() {

    this.store.dispatch( new SetInitialDataFL() );
    this.sub1 = this.isMobile$.subscribe(x => this.isMobile = x);
    this.sub2 = this.index$.subscribe(i => this.position = i);
    this.sub3 = this.dataLength$.subscribe(d => this.dataLength = d );

  }

  ngOnDestroy() {
    this._speech.cancel();
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }



  instructions = () => {

    this.store.dispatch( new ListenInstructionsFL() );

  }



  onSelect = (letterId: string) => {

    this.store.dispatch(new SelectLetterIdFL({letterId}));

  }



  listenWord = (word: string) => {

    this.store.dispatch( new ListenWordFL({ word }) );

  }



  calcPositionProgressBar(container: HTMLDivElement, mcCardIdentify: HTMLDivElement) {

    const hCard = mcCardIdentify.clientHeight;
    const hCont = container.clientHeight;
    const mHeight = 3;

    if (hCont > hCard) {
      const position = ((hCont - hCard) / 4) - mHeight;
      return {
        top: `${position}px`
      };
    }

  }



  calcPercentPosition() {

    const stepLength = 100 / this.dataLength;
    const position = -(this.position * stepLength);

    return { 'transform': `translateX(${position}%)` };

  }

}

