import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';
import { ReadingCourseState     } from 'src/app/store/state/reading-course.state';
import { Observable     } from 'rxjs';
import { Store, Select  } from '@ngxs/store';
import { AppState       } from 'src/app/store/state/app.state';
import { IsSettingDataDL, SetInitialDataDL } from '../../store/actions/reading-course/reading-course-draw-letter.actions';

@Component({
  selector: 'app-draw-letter',
  templateUrl: './draw-letter.component.html',
  styleUrls: ['./draw-letter.component.css']
})

export class DrawLetterComponent implements OnInit, OnDestroy {

  @Select(AppState.isMobile)                               isMobile$: Observable<boolean>;
  @Select(ReadingCourseState.dlIsSettingData)         isSettingData$: Observable<boolean>;
  @Select(ReadingCourseState.dlShowHandwriting)     showHandwriting$: Observable<boolean>;
  @Select(AppState.queryMobileMatch)               queryMobileMatch$: Observable<boolean>;
  @Select(ReadingCourseState.dlShowSuccessScreen) showSuccessScreen$: Observable<boolean>;

  constructor(
    private store: Store,
    private _speech: SpeechSynthesisService
  ) {
    this.store.dispatch( new IsSettingDataDL({state: true}) );
  }

  ngOnInit() {
    this.store.dispatch(new SetInitialDataDL());
  }


  ngOnDestroy() {
    this._speech.cancel();
  }


}
