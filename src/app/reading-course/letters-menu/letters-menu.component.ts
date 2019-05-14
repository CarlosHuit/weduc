import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ItemLetterMenu } from 'src/app/models/reading-course/item-letter-menu.model';
import { GetInitialData } from 'src/app/store/actions/reading-course/reading-course-data.actions';
import { ChangeActiveTab, SetInitialDataMenu } from 'src/app/store/actions/reading-course/reading-course-menu.actions';
import { AppState } from 'src/app/store/state/app.state';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';


@Component({
  selector: 'app-letters-menu',
  templateUrl: './letters-menu.component.html',
  styleUrls: ['./letters-menu.component.css']
})

export class LettersMenuComponent implements OnInit, OnDestroy {


  @Select(ReadingCourseState.lettersMenu)       lettersMenu$:       Observable<ItemLetterMenu[]>;
  @Select(AppState.isMobile)                    isMobile$:          Observable<boolean>;
  @Select(AppState.queryMobileMatch)            queryMobileMatch$:  Observable<boolean>;
  @Select(ReadingCourseState.isLoadingData)     loading$:           Observable<boolean>;
  @Select(ReadingCourseState.activeTab)         activeTab$:         Observable<string>;
  @Select(ReadingCourseState.canSpeech)         canSpeech$:         Observable<boolean>;

  constructor( private speechSynthesis: SpeechSynthesisService, public store: Store ) {

    this.store.dispatch( new SetInitialDataMenu() );
  }

  ngOnInit() {

    this.store.dispatch(new GetInitialData());

  }

  ngOnDestroy() {

    this.speechSynthesis.cancel();

  }

  goToAlphabet       = () => this.store.dispatch(new ChangeActiveTab({tab: 'alphabet'}));
  goToLearnedLetters = () => this.store.dispatch(new ChangeActiveTab({tab: 'learneds'}));





}
