import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { GetInitialData } from 'src/app/store/actions/reading-course/reading-course-data.actions';
import {
  ChangeActiveTab,
  ActiveRedirection,
  SetInitialDataMenu,
  ListenSpecificLetterMenu,
  ListenSoundLetterMenu,
  ListenWordAndLetter
} from 'src/app/store/actions/reading-course/reading-course-menu.actions';
import { Observable, Subscription } from 'rxjs';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { ReadingCourseState   } from 'src/app/store/state/reading-course.state';
import { Store, Select      } from '@ngxs/store';
import { AppState       } from 'src/app/store/state/app.state';


@Component({
  selector: 'app-letters-menu',
  templateUrl: './letters-menu.component.html',
  styleUrls: ['./letters-menu.component.css']
})

export class LettersMenuComponent implements OnInit, OnDestroy {

  @ViewChild('contGrid') contGrid: ElementRef;
  canSpeech:         boolean;
  isMobile:          boolean;
  hasLearnedLetters: boolean;

  @Select(ReadingCourseState.lettersMenu)       lettersMenu$:       Observable<{ letter: string, imgUrl: string, word: string }[]>;
  @Select(AppState.isMobile)                    isMobile$:          Observable<boolean>;
  @Select(AppState.queryMobileMatch)            queryMobileMatch$:  Observable<boolean>;
  @Select(ReadingCourseState.isLoadingData)     loading$:           Observable<boolean>;
  @Select(ReadingCourseState.hasLearnedLetters) hasLearnedLetters$: Observable<boolean>;
  @Select(ReadingCourseState.activeTab)         activeTab$:         Observable<string>;
  @Select(ReadingCourseState.selectedLetter)    selectedLetter$:    Observable<string>;
  @Select(ReadingCourseState.highlightLetter)   highlightLetter$:   Observable<{letter: string, type: string}>;
  @Select(ReadingCourseState.canSpeech)         canSpeech$:         Observable<boolean>;
  s1: Subscription;
  s3: Subscription;
  s4: Subscription;


  constructor(
    private speechSynthesis: SpeechSynthesisService,
    public store: Store
  ) {

    this.store.dispatch( new SetInitialDataMenu() );
  }

  ngOnInit() {

    this.store.dispatch(new GetInitialData());
    this.s1 = this.isMobile$.subscribe( state => this.isMobile = state );
    this.s4 = this.canSpeech$.subscribe( status => this.canSpeech = status );
    this.s3 = this.hasLearnedLetters$.subscribe( status => this.hasLearnedLetters = status );

    (window as any).onresize = () => (this.genCols(this.contGrid.nativeElement), this.isMobile);

  }

  ngOnDestroy() {

    this.speechSynthesis.cancel();
    window.removeEventListener('resize', () => (this.genCols(this.contGrid.nativeElement), this.isMobile));

    this.s1.unsubscribe();
    this.s3.unsubscribe();
    this.s4.unsubscribe();

  }

  goToAlphabet       = () => this.store.dispatch(new ChangeActiveTab({tab: 'alphabet'}));
  goToLearnedLetters = () => this.store.dispatch(new ChangeActiveTab({tab: 'learneds'}));


  listenWord (letter: string, word: string) {
    return this.canSpeech
            ? this.store.dispatch(new ListenWordAndLetter({letter, word}))
            : null;
  }

  listenLetter (letter: string) {
    return this.canSpeech
            ? this.store.dispatch( new ListenSpecificLetterMenu({letter}) )
            : null;
  }

  listenSoundLetter (letter: string) {
    return this.canSpeech
            ? this.store.dispatch(new ListenSoundLetterMenu({letter}))
            : null;
  }


  redirect = (letter: string) => {
    return this.canSpeech
      ? this.store.dispatch( new ActiveRedirection({ letter }))
      : null;
  }

  genCols = (el: HTMLDivElement) => {

    const t = el.clientWidth % 320;
    const margin = 5 * 4;
    const minWidth = 300;

    if (t === 0) {

      return { 'grid-template-columns': `repeat(auto-fill, ${minWidth}px)` };

    } else {

      const ts = Math.floor(el.clientWidth / 300);
      const ttt = ts * margin;
      const twidth = (el.clientWidth - ttt) / ts;

      return ({ 'grid-template-columns': `repeat(auto-fill, ${twidth}px)` });

    }
  }


}
