import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LearnedLetter } from 'src/app/models/reading-course/learned-letter.model';
import { SortLearnedLettersByAlphabet, SortLearnedLettersByRating } from 'src/app/store/actions/reading-course/reading-course-data.actions';
import {
  ActiveRedirection,
  ListenMessage,
  ListenSpecificLetterMenu
} from 'src/app/store/actions/reading-course/reading-course-menu.actions';
import { AppState } from 'src/app/store/state/app.state';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';

@Component({
  selector: 'app-learned-letters',
  templateUrl: './learned-letters.component.html',
  styleUrls: ['./learned-letters.component.css']
})
export class LearnedLettersComponent implements OnInit {


  @ViewChild(MatAccordion) accordion: MatAccordion;
  multi: boolean;
  letterOpened: string;


  @Select(ReadingCourseState.learnedLetters)     data$: Observable<LearnedLetter[]>;
  @Select(ReadingCourseState.sortedBy)       sortedBy$: Observable<string>;
  @Select(AppState.isMobile)                 isMobile$: Observable<boolean>;
  @Select(AppState.queryMobileMatch) queryMobileMatch$: Observable<boolean>;

  constructor(private store: Store) { }

  ngOnInit( ) { }


  countStars = (rating: number) => {

    const t = [];
    for (let i = 0; i < rating; i++) { t.push(''); }
    return t;

  }



  itemOpened = (letter: string) => {

    setTimeout(() =>  this.letterOpened = letter , 10);

  }


  itemClosed = (letter: string) => {

    this.letterOpened = '';

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

    this.store.dispatch( new ActiveRedirection({letter}) );

  }

  listenLetter = (letter: string, type: string) => {

    if (type === 'u') {
      this.store.dispatch( new ListenSpecificLetterMenu({letter: letter.toUpperCase()}) );
    }

    if (type === 'l') {
      this.store.dispatch( new ListenSpecificLetterMenu({letter: letter.toLowerCase()}) );
    }

  }

  listenCombination = (syllableP: string, syllableW: string, letter: string) => {
    this.store.dispatch( new ListenMessage({ msg: syllableP }) );
  }



}
