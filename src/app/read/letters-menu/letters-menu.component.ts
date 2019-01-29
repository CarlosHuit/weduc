import { Component, OnInit, ViewChild, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { GetInitialData } from 'src/app/store/actions/reading-course/reading-course-data.actions';
import {
  ChangeActiveTab,
  SelectLetter,
  HighlightLetter,
  ActiveRedirection
} from 'src/app/store/actions/reading-course/reading-course-menu.actions';
import { Observable, Subscription } from 'rxjs';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { ReadingCourseState   } from 'src/app/store/state/reading-course.state';
import { Store, Select      } from '@ngxs/store';
import { MediaMatcher     } from '@angular/cdk/layout';
import { AppState       } from 'src/app/store/state/app.state';


@Component({
  selector: 'app-letters-menu',
  templateUrl: './letters-menu.component.html',
  styleUrls: ['./letters-menu.component.css']
})

export class LettersMenuComponent implements OnInit, OnDestroy {

  @ViewChild('contGrid') contGrid: ElementRef;
  _mobileQueryListener:  () => any;
  mobileQuery:       MediaQueryList;
  canSpeech:         boolean;
  isMobile:          boolean;
  hasLearnedLetters: boolean;
  letterSounds:      {};



  @Select(ReadingCourseState.letterSounds)      letterSounds$:      Observable<{}>;
  @Select(ReadingCourseState.lettersMenu)       lettersMenu$:       Observable<{ letter: string, imgUrl: string, word: string }[]>;
  @Select(AppState.isMobile)                    isMobile$:          Observable<boolean>;
  @Select(ReadingCourseState.isLoadingData)     loading$:           Observable<boolean>;
  @Select(ReadingCourseState.hasLearnedLetters) hasLearnedLetters$: Observable<boolean>;
  @Select(ReadingCourseState.activeTab)         activeTab$:         Observable<string>;
  @Select(ReadingCourseState.selectedLetter)    selectedLetter$:    Observable<string>;
  @Select(ReadingCourseState.highlightLetter)   highlightLetter$:   Observable<{letter: string, type: string}>;
  @Select(ReadingCourseState.canSpeech)         canSpeech$:         Observable<boolean>;
  s1: Subscription;
  s2: Subscription;
  s3: Subscription;
  s4: Subscription;


  constructor(
    private speechSynthesis: SpeechSynthesisService,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    public store: Store
  ) {

    this.mobileQuery = media.matchMedia('(max-width: 720px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit() {

    this.store.dispatch(new GetInitialData());
    this.s1 = this.isMobile$.subscribe( state => this.isMobile = state );
    this.s4 = this.canSpeech$.subscribe( status => this.canSpeech = status );
    this.s2 = this.letterSounds$.subscribe( x => this.letterSounds = x );
    this.s3 = this.hasLearnedLetters$.subscribe( status => this.hasLearnedLetters = status );

    (window as any).onresize = () => (this.genCols(this.contGrid.nativeElement), this.isMobile);

  }

  ngOnDestroy() {

    this.speechSynthesis.cancel();
    window.removeEventListener('resize', () => (this.genCols(this.contGrid.nativeElement), this.isMobile));
    this.mobileQuery.removeListener(this._mobileQueryListener);

    this.s1.unsubscribe();
    this.s2.unsubscribe();
    this.s3.unsubscribe();
    this.s4.unsubscribe();

  }

  goToAlphabet       = () => this.store.dispatch(new ChangeActiveTab({tab: 'alphabet'}));
  goToLearnedLetters = () => this.store.dispatch(new ChangeActiveTab({tab: 'learneds'}));


  listenWord = (letter: string, word: string) => {

    const lSound = this.letterSounds[letter];

    if (this.canSpeech) {

      console.log('sdd');
      this.store.dispatch( new SelectLetter({letter}) );


      if (word[0] === letter.toLowerCase() || word[0] === letter.toUpperCase()) {

        const msg    = `${word} ... comienza con la letra ... ${lSound}`;
        const speech = this.speechSynthesis.speak(msg, .95);
        speech.addEventListener('end', () => this.store.dispatch(new SelectLetter({letter: ''})));

      }

      const lower = new RegExp(letter.toLowerCase().trim());

      if (word[0] !== letter.toLowerCase() && lower.test(word)) {

        const msg    = `${word} contiene la letra ... ${lSound}`;
        const speech = this.speechSynthesis.speak(msg, .95);
        speech.addEventListener('end', () => this.store.dispatch(new SelectLetter({letter: ''})) );

      }

    }


  }

  listenLetter = (letter: string, type: string) => {

    if ( this.canSpeech ) {
      console.log('s');
      this.store.dispatch(new HighlightLetter({ letter, type }));

      const lSound = this.letterSounds[letter];
      const lType = type === 'l' ? 'minúscula' : 'mayúscula';
      const msg = `${lSound} ... ${lType}`;

      const speech = this.speechSynthesis.speak(msg, 0.8);
      speech.addEventListener('end', () => this.store.dispatch(new HighlightLetter({letter: '', type: ''})));

    }


  }


  listenSoundLetter = (letter: string) => {

    if ( this.canSpeech ) {
      console.log('s');

      this.store.dispatch(new SelectLetter({letter}));

      const sound  = this.letterSounds[letter];
      const speech = this.speechSynthesis.speak(sound, .8);
      speech.addEventListener('end', () => this.store.dispatch(new SelectLetter({letter: ''})));

    }

  }

  redirect = (letter: string) => {
    if ( this.canSpeech ) {

      console.log('redicrection desktop');
      const msg    = `Bien, Seleccionaste la letra: ... ${this.letterSounds[letter]}`;
      const url    = `lectura/seleccionar-palabras/${letter}`;
      this.store.dispatch( new ActiveRedirection({letter, msg, url}) );

    }
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
