import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { Store, Select          } from '@ngxs/store';
import { AppState               } from 'src/app/store/state/app.state';
import { Observable             } from 'rxjs';
import { GData                  } from 'src/app/store/models/reading-course/game/reading-course-game.model';
import { ReadingCourseState     } from 'src/app/store/state/reading-course.state';
import {
  SetInitialDataG,
  RestartDataG,
  IsSettingDataG,
  SelectLetterG,
  ResetDataG,
  UseHelpG
} from 'src/app/store/actions/reading-course/reading-course-game.actions';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit, OnDestroy, AfterViewInit {


  @ViewChild('mcGame') mcLetters:    ElementRef;
  mcGameEl:         HTMLDivElement;

  @Select(ReadingCourseState.gIsSettingData)  isSettingData$: Observable<boolean>;
  @Select(ReadingCourseState.gSelections)        selections$: Observable<{}>;
  @Select(ReadingCourseState.gProgress)            progress$: Observable<number>;
  @Select(AppState.isMobile)                       isMobile$: Observable<boolean>;
  @Select(AppState.queryMobileMatch)       queryMobileMatch$: Observable<boolean>;
  @Select(ReadingCourseState.gCurrentLetter)         letter$: Observable<string>;
  @Select(ReadingCourseState.gData)                   gData$: Observable<string[][]>;
  @Select(ReadingCourseState.gCurrentData)             data$: Observable<GData>;
  @Select(ReadingCourseState.gShowCorrectLetters)       showCorrectLetters$: Observable<boolean>;
  @Select(ReadingCourseState.gShowSuccessScreen)         showSuccessScreen$: Observable<boolean>;

  constructor (
    private speechService: SpeechSynthesisService,
    private store:         Store,
  ) {
    this.store.dispatch( new IsSettingDataG({state: true}) );
  }

  ngAfterViewInit() {
    this.mcGameEl = this.mcLetters.nativeElement;
    this.store.dispatch(new SetInitialDataG({ containerWidth: this.mcGameEl.clientWidth }));
  }

  ngOnInit() {
    window.addEventListener('resize', this.restartData);
  }
  ngOnDestroy() {
    this.speechService.cancel();
    this.store.dispatch( new ResetDataG() );
    window.removeEventListener('resize', this.restartData);
  }

  restartData = () =>  setTimeout(() => {

    const containerWidth = this.mcLetters.nativeElement.clientWidth;
    this.store.dispatch( new RestartDataG({ containerWidth }) );

  }, 5)

  onSelect = (letterId: string) => this.store.dispatch( new SelectLetterG({ letterId }) );
  help = () => this.store.dispatch(new UseHelpG());

}



  /*---------- Collect Data  ------------*/
/*   initUserData = () => {

    const t = this.genDates.generateData();
    const id  = this._storage.getElement('user')['userId'];
    this.userData = new GameData(id, t.fullDate, t.fullTime, 'N/D', this.letter, this.countLetters(), 0, 0, [], []);
  }

  addSelection = (letter: string, status: boolean) => {

    const t = this.genDates.generateData().fullTime;
    this.userData.historial.push(new History(letter, t, status));

  }


  insertGroupOfSelection = () => {

    this.addFinalTime();
    const m = JSON.parse(JSON.stringify(this.userData));
    this.dataToSend.push(m);

  }


  addFinalTime = (): void => {

    this.userData.correct   = this.succesCount;
    this.userData.incorrect = this.failedCount;

    const t = this.genDates.generateData().fullTime;
    this.userData.finalTime = t;

  }

  countLetters = (): number => {

    let count = 0;
    this.letterIDs.forEach(g => g.forEach(e => e[0] === this.letter ? count++ : false ));
    return count;

  }

  countRepetitions = () => {
    const t = this.genDates.generateData().fullTime;
    this.userData.repetitions.push(t);
  }

  send = () => {

    this._sendData.sendGameData(this.dataToSend)
      .subscribe(
        val => {const v = val; },
        err => {const e = err; }
      );

  }
 */


