import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription   } from 'rxjs';
import { SpeechSynthesisService  } from '../../services/speech-synthesis.service';
import { ReadingCourseState  } from 'src/app/store/state/reading-course.state';
import { Store, Select   } from '@ngxs/store';
import { AppState   } from 'src/app/store/state/app.state';
import { SLData } from 'src/app/store/models/reading-course/letter-detail/reading-course-letter-detail.model';
import {
  SetInitialDataLD,
  HideLetterCardLD,
  SelectLetterLD,
  ListenLetterPresentationLD,
  ShowLetterCardLD
} from '../../store/actions/reading-course/reading-course-letter-detail.actions';

@Component({
  selector: 'app-letters-detail',
  templateUrl: './letters-detail.component.html',
  styleUrls: ['./letters-detail.component.css']
})

export class LettersDetailComponent implements OnInit, OnDestroy {


  canPlayGame: boolean;
  sub1: Subscription;


  @Select(ReadingCourseState.ldShowLetterCard) showLetterCard$: Observable<boolean>;
  @Select(ReadingCourseState.ldIsSettingData)   isSettingData$: Observable<boolean>;
  @Select(ReadingCourseState.ldCanPlayGame)       canPlayGame$: Observable<boolean>;
  @Select(AppState.isMobile)                         isMobile$: Observable<boolean>;
  @Select(ReadingCourseState.ldCurrentData)              data$: Observable<SLData>;
  @Select(ReadingCourseState.ldshowSuccessScreen) showSuccessScreen$: Observable<boolean>;
  @Select(AppState.queryMobileMatch) queryMobileMatch$: Observable<boolean>;


  constructor( private speech: SpeechSynthesisService, private store: Store ) { }

  ngOnInit() {

    this.store.dispatch( new SetInitialDataLD() );
    this.sub1 = this.canPlayGame$.subscribe(state => this.canPlayGame = state);

  }

  ngOnDestroy () {

    this.speech.cancel();
    this.sub1.unsubscribe();

  }


  listenLetterPresentation = () => {

    this.store.dispatch( new ListenLetterPresentationLD() );

  }


  continue = () => this.store.dispatch( new HideLetterCardLD({ listenMsg: true }));


  onSelect = (letterId: string) => {

    return this.canPlayGame ? this.store.dispatch( new SelectLetterLD({letterId}) ) : null;

  }


  showLetterDetailModal() {

    return this.store.dispatch(new ShowLetterCardLD() );

  }


  style = (el: HTMLElement) => {

    const width  = el.clientWidth;
    const height = el.clientHeight;
    const percent = 0.92;

    /// landscape
    if (width > height) {

      return {
        'width':  `${height * percent}px`,
        'height': `${height * percent}px`
      };

    }

    /// portrait
    return {
      'width':  `${width * percent}px`,
      'height': `${width * percent}px`
    };

  }


}
