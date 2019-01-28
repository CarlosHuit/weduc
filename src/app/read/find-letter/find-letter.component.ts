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

  @Select(ReadingCourseState.flShowSuccessScreen) showSuccessScreen$: Observable<boolean>;
  @Select(AppState.queryMobileMatch)               queryMobileMatch$: Observable<boolean>;
  @Select(ReadingCourseState.flLettersQuantity)     lettersQuantity$: Observable<number>;
  @Select(ReadingCourseState.flIsSettingData)         isSettingData$: Observable<boolean>;
  @Select(ReadingCourseState.flDisableAll)               disableAll$: Observable<boolean>;
  @Select(AppState.isMobile)                               isMobile$: Observable<boolean>;
  @Select(ReadingCourseState.flAdvance)                     advance$: Observable<number>;
  @Select(ReadingCourseState.flCurrentData)                    data$: Observable<FLData>;
  @Select(ReadingCourseState.flSelections)               selections$: Observable<{}>;
  @Select(ReadingCourseState.flCorrectSelections)      correctsSels$: Observable<{}>;
  @Select(ReadingCourseState.flWrongSelections)           wrongSels$: Observable<{}>;

  isMobile:        boolean;
  word:            string;
  lettersQuantity: number;

  sub2: Subscription;

  constructor(
    private _speech:    SpeechSynthesisService,
    private store: Store
  ) {

    this.store.dispatch( new IsSettingDataFL({state: true}) );
  }

  ngOnInit() {

    this.store.dispatch( new SetInitialDataFL() );
    this.sub1 = this.isMobile$.subscribe(x => this.isMobile = x);
    this.sub2 = this.lettersQuantity$.subscribe( q => this.lettersQuantity = q );

  }

  ngOnDestroy() {
    this._speech.cancel();
  }



  instructions = () => this.store.dispatch( new ListenInstructionsFL() );

  onSelect = (letterId: string) => this.store.dispatch(new SelectLetterIdFL({letterId}));

  listenWord = () => this.store.dispatch( new ListenWordFL() );

  genStyles = (el: HTMLDivElement, container: HTMLDivElement) => {

    const lenght  = this.lettersQuantity;
    const cWidth  = container.clientWidth;
    const cHeight = container.clientHeight;
    const w       = el.clientWidth;

    if (cHeight > cWidth) {
      if (lenght <= 4) {

        return { 'min-width': `55px`, 'font-size': `${w * 0.16}px` };

      } else if ( lenght > 4 && lenght <= 6 ) {

        return { 'min-width': `45px`, 'font-size': `${w * 0.16}px` };

      } else if (lenght === 7 ) {

        return { 'min-width': `35px`, 'font-size': `${w * 0.16}px` };

      } else if (lenght > 7 ) {

        return { 'min-width': `30px`, 'font-size': `${w * 0.135}px` };

      }

    }

    if (cHeight < cWidth) {

      if (lenght <= 6) {

        return { 'min-width': `45px`, 'font-size': `${w * 0.135}px` };

      } else {

        return { 'min-width': `38px`, 'font-size': `${w * 0.10}px` };

      }

    }

  }

  genSizeDesk = (el: HTMLDivElement) => {
    return {
      'width': `${el.clientHeight}px`,
      'heght': `${el.clientHeight}px`
    };
  }



}

/* initUserData = (): void => {

  const t  = this.genDates.generateData();
  const id = this._storage.getElement('user')['userId'];
  this.userData = new FindLetterData(id, t.fullDate, t.fullTime, 'N/A', this.letterParam, []);

}

addWordData = (word): void => {

  const t = this.genDates.generateData().fullTime;
  const x = new Options(word, t, 'N/A', 0, 0, [], [], []);
  this.userData.words.push(x);

}

addCount = (word: string, code: string, letter?: string, state?: boolean): void => {

  const t = this.genDates.generateData().fullTime;
  const i = this.userData.words.findIndex(m => m.word === word );
  const e = this.userData.words[i];

  const pImg  = code === 'pressImage'   ? e.pressImage.push(t)   : null;
  const pHelp = code === 'instructions' ? e.instructions.push(t) : null;

  if (code  === 'correct' || code === 'incorrect') {
    e[code]++;
    e.historial.push(new Selection(letter, t, state));
  }

}

addFinalTimeWord = (word: string): void => {

  const t = this.genDates.generateData().fullTime;
  const i = this.userData.words.findIndex(m => m.word === word);
  this.userData.words[i].finalTime = t;

}

addFinalTimeComponent = (): void => {

  this.userData.finalTime = this.genDates.generateData().fullTime;
}

send = () => {

  this._sendData.sendDrawLetters(this.userData)
    .subscribe(
      val => { const v = val; },
      err => { const e = err; }
    );
} */
