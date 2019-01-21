import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subscription   } from 'rxjs';
import { SpeechSynthesisService  } from '../../services/speech-synthesis.service';
import { ReadingCourseState  } from 'src/app/store/state/reading-course.state';
import { Store, Select   } from '@ngxs/store';
import { AppState   } from 'src/app/store/state/app.state';
import { SLData } from 'src/app/store/models/reading-course/letter-detail/reading-course-letter-detail.model';
import {
  SetInitialDataLD,
  HideLetterCardLD,
  SelectLetterLD
} from '../../store/actions/reading-course/reading-course-letter-detail.actions';

@Component({
  selector: 'app-letters-detail',
  templateUrl: './letters-detail.component.html',
  styleUrls: ['./letters-detail.component.css']
})

export class LettersDetailComponent implements OnInit, OnDestroy {

  @ViewChild('card') card: ElementRef;
  canPlayGame: boolean;
  sub1: Subscription;


  @Select(ReadingCourseState.ldShowLetterCard) showLetterCard$: Observable<boolean>;
  @Select(ReadingCourseState.ldIsSettingData)   isSettingData$: Observable<boolean>;
  @Select(ReadingCourseState.ldCanPlayGame)       canPlayGame$: Observable<boolean>;
  @Select(ReadingCourseState.ldShowAllCards)      showAllCard$: Observable<boolean>;
  @Select(AppState.isMobile)                         isMobile$: Observable<boolean>;
  @Select(ReadingCourseState.ldCurrentData)              data$: Observable<SLData>;
  @Select(ReadingCourseState.ldsel1)                     sel1$: Observable<string>;
  @Select(ReadingCourseState.ldsel2)                     sel2$: Observable<string>;
  @Select(ReadingCourseState.ldshowSuccessScreen) showSuccessScreen$: Observable<boolean>;

  constructor( private speech: SpeechSynthesisService, private store: Store ) { }

  ngOnInit() {

    this.store.dispatch( new SetInitialDataLD() );
    this.sub1 = this.canPlayGame$.subscribe(state => this.canPlayGame = state);
    (window).addEventListener('resize', e => this.style(this.card.nativeElement));

  }

  ngOnDestroy () {

    this.speech.cancel();
    this.sub1.unsubscribe();

  }



  continue = () => this.store.dispatch( new HideLetterCardLD({ listenMsg: true }));
  onSelect = (letterId: string) => this.canPlayGame
                                ? this.store.dispatch( new SelectLetterLD({letterId}) )
                                : null



  /*----- calculate styles of elements  -----*/
  style = (el: HTMLElement) => {

    const width  = el.clientWidth;
    const height = el.clientHeight;
    const percent = .92;
    if (width > height) {
      return {
        'width':  `${height * percent}px`,
        'height': `${height * percent}px`
      };
    } else {
      return {
        'width':  `${width * percent}px`,
        'height': `${width * percent}px`
      };
    }

  }

  calcOpt = (el: HTMLElement) => ({ 'width': `${el.clientWidth * .332}px`, 'height': `${el.clientWidth * .332}px` });
  calcFZ = (el: HTMLElement) => ({ 'font-size': `${el.clientWidth * .5}px` });



/*----- Collect User data -----*/

/*   initUserData = () => {

    const t  = this.genDates.generateData();
    const id = this._storage.getElement('user')['userId'];
    const cE = new CardExample(t.fullTime, 'N/D', [], []);
    const mG = new MemoryGame('N/D', 'N/D', this.currentIds, [], []);

    this.userData = new LettersDetailData(id, this.currentLetter, t.fullDate, t.fullTime, 'N/D', cE, mG);
  }

  addDataToCardExample = (code: number) => {

    const path = this.userData.cardExample;
    const t    = this.genDates.generateData().fullTime;

    switch (code) {
      case 2040:
        path.listenMsg.push(t);
        break;
      case 2041:
        path.listenLetter.push(t);
        break;
      case 2042:
        path.finalTime = t;
        break;
      default:
        break;
    }

  }

  addFinalTime = () => {
    this.userData.finalTime = this.genDates.generateData().fullTime;
  }

  addDataToMemoryGame = (code: number, fLetter?: string, sLetter?: string) => {

    const path = this.userData.memoryGame;
    const t = this.genDates.generateData().fullTime;

    switch (code) {
      case 3040:
        path.startTime = t;
        break;
      case 3041:
        path.finalTime = t;
        this.addFinalTime();
        break;
      case 3043:
        const x = new Couples(fLetter, sLetter);
        path.couples.push(x);
        break;
      case 3044:
        const s = fLetter === this.currentLetter ? true : false;
        const h = new Historial(t, fLetter, s);
        path.historial.push(h);
        break;
      default:
        break;
    }

  }

  sendDataToServer = () => {

    this._sendData.sendLettersDetailData(this.Data)
      .subscribe(
        val => {const t = val; },
        err => {const w = err; },
      );

  } */

}
