import { Component, OnInit, ViewChild } from '@angular/core';
import { LearnedLetters         } from '../../../classes/learned-letters';
import { MatAccordion           } from '@angular/material';
import { Select, Store          } from '@ngxs/store';
import { ReadingCourseState     } from 'src/app/store/state/reading-course.state';
import { Observable             } from 'rxjs';
import { AppState               } from 'src/app/store/state/app.state';
import { Navigate               } from '@ngxs/router-plugin';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';
import {
  SortLearnedLettersByRating,
  SortLearnedLettersByAlphabet
} from 'src/app/store/actions/reading-course/reading-course-data.actions';

@Component({
  selector: 'app-learned-letters',
  templateUrl: './learned-letters.component.html',
  styleUrls: ['./learned-letters.component.css']
})
export class LearnedLettersComponent implements OnInit {


  @ViewChild(MatAccordion) accordion: MatAccordion;
  multi: boolean;

  letterSounds: {};

  @Select(ReadingCourseState.learnedLetters) data$:   Observable<LearnedLetters[]>;
  @Select(ReadingCourseState.sortedBy) sortedBy$:   Observable<string>;
  @Select(AppState.isMobile)        isMobile$:    Observable<boolean>;

  constructor(private store: Store, private speechSynthesis: SpeechSynthesisService) { }

  ngOnInit( ) {
    this.letterSounds = this.store.selectSnapshot(state => state.readingCourse.data.letterSounds);
  }


  countStars = (rating: number) => {

    const t = [];
    for (let i = 0; i < rating; i++) { t.push(''); }
    return t;

  }



  itemOpened = (letter: string) => {
    // this.speechSynthesis.cancel();
    // const index = this.userData.tab_learned.previewLetters.findIndex(e => e.letter === letter);
    // const time = this.genDate.generateData().fullTime;
    // const t  = new Times(time, 'N/A');

    // if (index === -1) {

    //   const s = [];
    //   this.combinations[letter].forEach(i => s.push(new Syllable(i.w, [])));
    //   const el = new PreviewLetter(letter, [t], [], [], s, 'N/D');
    //   this.userData.tab_learned.previewLetters.push(el);

    // } else {

    //   const path = this.userData.tab_learned.previewLetters;
    //   const item = path[index].time.push(t);

    // }

    console.log('opened');


  }


  itemClosed = (letter: string) => {

    // this.speechSynthesis.cancel();
    // const t     = this.genDate.generateData().fullTime;
    // const path  = this.userData.tab_learned.previewLetters;
    // const index = path.findIndex( e => e.letter === letter);
    // const el    = path[index].time;
    // const val   = index > -1 ? el[el.length - 1].finalTime = t : null;
    console.log('closed');
  }

  sortRating = () => {
    this.closeAllExpansion();
    this.store.dispatch(new SortLearnedLettersByRating());
  }


  sortAlpha = () => {
    this.closeAllExpansion();
    this.store.dispatch( new SortLearnedLettersByAlphabet() );
  }


  closeAllExpansion = () => {
    this.multi = true;
    setTimeout(() => (this.accordion.closeAll(), this.multi = false), 0);
  }


  repractice = (letter: string) => {
    const url = `lectura/encontrar-letras/${letter.toLowerCase()}`;
    this.store.dispatch(new Navigate([url]));
  }

  listenLetter = (letter: string, type: string) => {

    const lSound = this.letterSounds[letter];
    const lType  = type === 'l' ? 'minúscula' : 'mayúscula';
    const msg    = `${lSound} ... ${lType}`;
    const speech = this.speechSynthesis.speak(msg, 0.8);


  }





  listenCombination = (syllableP: string, syllableW: string, letter: string) => {
    const speech = this.speechSynthesis.speak(syllableP, .8);
  }



}
