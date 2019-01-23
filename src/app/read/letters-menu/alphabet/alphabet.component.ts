import { Component, Input, OnDestroy, OnInit   } from '@angular/core';
import { ActiveRedirection, SelectLetter } from 'src/app/store/actions/reading-course/reading-course-menu.actions';
import { Observable, Subscription } from 'rxjs';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/store/state/app.state';

@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.css']
})
export class AlphabetComponent implements OnDestroy, OnInit {

  @Input()  contGrid:     HTMLDivElement;

  isMobile:      boolean;
  canSpeech:     boolean;
  subsIsMobile:  Subscription;
  subsCanSpeech: Subscription;
  letterSounds: {};


  @Select(ReadingCourseState.selectedLetter) selectedLetter$: Observable<string>;
  @Select(ReadingCourseState.lettersMenu)       lettersMenu$: Observable<{letter: string, imgUrl: string, word: string}[]>;
  @Select(ReadingCourseState.canSpeech)           canSpeech$: Observable<boolean>;
  @Select(AppState.isMobile) isMobile$: Observable<boolean>;


  constructor( private store: Store, private speech: SpeechSynthesisService ) { }


  ngOnInit() {
    this.letterSounds  = this.store.selectSnapshot( state => state.readingCourse.data.letterSounds);
    this.subsIsMobile  = this.isMobile$.subscribe( status => this.isMobile = status);
    this.subsCanSpeech = this.canSpeech$.subscribe(x => this.canSpeech = x);
  }

  ngOnDestroy() {
    this.subsIsMobile.unsubscribe();
    this.subsCanSpeech.unsubscribe();
  }



  listenLetter = (letter: string) => {

    if (this.canSpeech) {
      this.store.dispatch(new SelectLetter({letter}));
      const speech = this.speech.speak(this.letterSounds[letter]);
      speech.addEventListener('end', () => this.store.dispatch(new SelectLetter({letter: ''})));
    }

  }


  genCols = (el: HTMLDivElement) => {

    if ( this.isMobile ) {

      const t = el.clientWidth % 320;
      const margin = 5 * 4;
      const minWidth = 300;

      if (t === 0) {

        return { 'grid-template-columns': `repeat(auto-fill, ${minWidth}px)` };

      } else {
        const ts     = Math.floor(el.clientWidth / 300);
        const ttt    = ts * margin;
        const twidth = (el.clientWidth - ttt) / ts;

        return ({ 'grid-template-columns': `repeat(auto-fill, ${twidth}px)` });

      }
    }

    if ( !this.isMobile ) {

      const width = el.clientWidth;

      if ( width > 500 ) {

        return ({ 'grid-template-columns': `repeat(auto-fill, ${width * 0.75}px)` });

      }

      if ( width < 500 ) {

        return ({ 'grid-template-columns': `repeat(auto-fill, ${width * 0.95}px)` });

      }
    }

  }

  redirect = (letter: string) => {
    if ( this.canSpeech ) {
      const msg    = `Bien, Seleccionaste la letra: ... ${this.letterSounds[letter]}`;
      const url    = `lectura/dibujar-letra/${letter}`;
      this.store.dispatch( new ActiveRedirection({letter, msg, url}) );
    }
  }


}
