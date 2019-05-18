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

  @Select(ReadingCourseState.flData) fldata$: Observable<FLData[]>;

  isMobile:        boolean;
  word:            string;
  lettersQuantity: number;

  data = ['#ff0000', '#663399', '#20b2aa', '#ff69b4'];

  position = 0;

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

  listenWord = (word: string) => this.store.dispatch( new ListenWordFL({ word }) );

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

  genStyles = (el: HTMLDivElement) => {

    const maxLetters  = this.lettersQuantity;

    const cWidth  = window.innerWidth;
    const cHeight = window.innerHeight;
    const margin = maxLetters * 2.5;

    const w       = el.clientWidth;
    const portrait = cHeight > cWidth ? true : false;

    if ( portrait && cWidth < 540 ) {

      if (maxLetters <= 4) {

        return {
          'min-width': '55px',
          'font-size': '55px'
        };

      } else if ( maxLetters > 4 && maxLetters <= 6 ) {

        const minWidth = ((w * 0.8 ) - margin) / maxLetters;

        return {
          'min-width': `${minWidth}px`,
          'font-size': '50px'
        };

      } else if (maxLetters === 7 ) {

        const minWidth = ( w / 8 );

        return {
          'min-width': `${minWidth}px`,
          'font-size': '45px'
        };

      } else if (maxLetters > 7 ) {


        const minWidth = (w - margin) / maxLetters;

        return {
          'min-width': `${minWidth}px`,
          'font-size': '35px'
        };


      }

    }

    if (cHeight < cWidth) {

      if (maxLetters <= 6) {

        return { 'min-width': `45px`, 'font-size': `${w * 0.135}px` };

      } else {

        return { 'min-width': `38px`, 'font-size': `${w * 0.10}px` };

      }

    }

  }


  prev(index: number) {

    this.position = index - 1;

  }

  next(index: number) {

    this.position = index + 1;

  }

  calcPercentPosition() {

    const s = 100 / this.data.length;
    const position = -(this.position * s);
    return {
      'transform': `translateX(${position}%)`
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
