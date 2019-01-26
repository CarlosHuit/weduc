import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HandwritingComponent } from './handwriting/handwriting.component';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { BoardComponent  } from './board/board.component';
import { Store, Select } from '@ngxs/store';
import { Coordinates } from '../../classes/coordinates';
import { Preferences } from 'src/app/store/models/reading-course/draw-letter/reading-course-draw-letter.model';
import { Observable } from 'rxjs';
import { AppState  } from 'src/app/store/state/app.state';
import {
  IsSettingDataDL,
  SetInitialDataDL,
  HideHandwritingDL
} from 'src/app/store/actions/reading-course/reading-course-draw-letter.actions';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';

@Component({
  selector: 'app-draw-letter',
  templateUrl: './draw-letter.component.html',
  styleUrls: ['./draw-letter.component.css']
})

export class DrawLetterComponent implements OnInit, OnDestroy {

  @ViewChild(HandwritingComponent) handWriting: HandwritingComponent;
  @ViewChild(BoardComponent) boardComponent: BoardComponent;

  currentLetter:  string;


  @Select(AppState.isMobile)                           isMobile$: Observable<boolean>;
  @Select(AppState.queryMobileMatch)           queryMobileMatch$: Observable<boolean>;
  @Select(ReadingCourseState.dlCurrentData)                data$: Observable<Coordinates>;
  @Select(ReadingCourseState.dlPreferences)         preferences$: Observable<Preferences>;
  @Select(ReadingCourseState.currentLetter)       currentLetter$: Observable<string>;
  @Select(ReadingCourseState.dlIsSettingData)     isSettingData$: Observable<boolean>;
  @Select(ReadingCourseState.dlShowHandwriting) showHandwriting$: Observable<boolean>;
  @Select(ReadingCourseState.dlShowSuccessScreen) showSuccessScreen$: Observable<boolean>;

  isMobile: boolean;

  constructor( private store: Store, private _speech: SpeechSynthesisService ) {
    this.store.dispatch( new IsSettingDataDL({state: true}) );
  }

  ngOnInit() {
    this.store.dispatch(new SetInitialDataDL());
    this.isMobile$.subscribe(state => this.isMobile = state);
    this.currentLetter$.subscribe(l => this.currentLetter = l);
  }

  ngOnDestroy() {
    this._speech.cancel();
  }




  showHandWritingAndAnimate = () => {

    this.handWriting.limpiar();
    this.handWriting.startExample();

  }


  // const msg       = `Bien, ahora ya sabes escribir la letra: ${sound} .... "${type}"`;



  closeHandwriting = (ev: MouseEvent) => {
    if (ev.srcElement.id === 'handWriting') {
      this.store.dispatch( new HideHandwritingDL() );
    }
  }

  hideHandwriting = () => this.store.dispatch( new HideHandwritingDL() );


}
