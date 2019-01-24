import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IsSettingDataDL, SetInitialDataDL } from 'src/app/store/actions/reading-course/reading-course-draw-letter.actions';
import { HandwritingComponent   } from './handwriting/handwriting.component';
import { BoardComponent         } from './board/board.component';
import { DrawLettersData, Board } from '../../classes/draw-letter-data';
import { ControlCanvas          } from '../../classes/control-canvas';
import { Coordinates            } from '../../classes/coordinates';
import { Store, Select          } from '@ngxs/store';
import { AppState               } from 'src/app/store/state/app.state';
import { Observable             } from 'rxjs';
import { ReadingCourseState     } from 'src/app/store/state/reading-course.state';
import { Preferences            } from 'src/app/store/models/reading-course/draw-letter/reading-course-draw-letter.model';
import { Navigate               } from '@ngxs/router-plugin';

@Component({
  selector: 'app-draw-letter',
  templateUrl: './draw-letter.component.html',
  styleUrls: ['./draw-letter.component.css']
})

export class DrawLetterComponent implements OnInit, OnDestroy {

  @ViewChild(HandwritingComponent) handWriting: HandwritingComponent;
  @ViewChild(BoardComponent) boardComponent: BoardComponent;

  currentLetter:  string;
  showBoard:      boolean;



  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  @Select(AppState.queryMobileMatch) queryMobileMatch$: Observable<boolean>;
  @Select(ReadingCourseState.dlCurrentData) data$: Observable<Coordinates>;
  @Select(ReadingCourseState.dlPreferences) preferences$: Observable<Preferences>;
  @Select(ReadingCourseState.dlIsSettingData) isSettingData$: Observable<boolean>;
  @Select(ReadingCourseState.currentLetter) currentLetter$: Observable<string>;

  isMobile: boolean;

  constructor( private store: Store ) {
    this.store.dispatch( new IsSettingDataDL({state: true}) );
  }

  ngOnInit() {
    this.store.dispatch(new SetInitialDataDL());
    this.isMobile$.subscribe(state => this.isMobile = state);
    this.currentLetter$.subscribe(l => this.currentLetter = l);
  }

  ngOnDestroy() {
  }


  eventsControlCanvas = (ev: ControlCanvas) => {
    const x = ev;
    this.boardComponent.limpiar();
  }

  eventsHandWriting = (ev) => {

    if ( ev === 'repeat' ) {
    } else {

      this.showBoard = true;
      this.handWriting.limpiar();
      this.boardComponent.limpiar();

    }

  }

  eventsBoard = (ev?) => {

    if (ev === 'repeat') {

      this.showHandWritingAndAnimate();

    } else {

      const data     = JSON.parse(ev);
      const d: Board = data.boardData;

      if (data.showHandwriting === true) {

        this.showHandWritingAndAnimate();

      } else {


      }

    }


  }

  showHandWritingAndAnimate = () => {

    this.showBoard = false;
    this.handWriting.limpiar();
    this.handWriting.startExample();

  }


  // const msg       = `Bien, ahora ya sabes escribir la letra: ${sound} .... "${type}"`;

  redirect = (): void => {

    const url = `lectura/encontrar-letras/${this.currentLetter}`;
    this.store.dispatch( new Navigate([url]) );

  }

  // initUserData = () => {
  //   const t  = this.genDates.generateData();
  //   const id = this._storage.getElement('user')['userId'];

  //   this.userData = new DrawLettersData(id, t.fullTime, 'N/A', t.fullDate, this.currentLetter, [], []);

  // }

  // addRepeatTime = () => {

  //   const t = this.genDates.generateData().fullTime;
  //   this.userData.handWriting.push(t);

  // }

  // addFinalTime = () => {

  //   const t = this.genDates.generateData().fullTime;
  //   this.userData.finalTime = t;

  // }

  repeatHandWriting = () => {
    this.handWriting.repeat();
  }

  hideHandWriting = () => {
    this.handWriting.hide();
  }

  hideBoard = () => {
    this.boardComponent.showModal();
  }

  clearCanvasBoard = () => {
    this.boardComponent.clearCanvas();
  }

  nextElementBoard = () => {
    this.boardComponent.nextLetter();
  }


  genContainer = () => {
    if (this.isMobile) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < h) {
        return {
          'width': '100%',
          'height': 'calc(100vh - 56px)',
        };
      } else {
        return {
          height: '100vh'
        };
      }
    }
  }



}
