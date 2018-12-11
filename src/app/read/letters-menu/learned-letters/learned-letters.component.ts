import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { LearnedLetters      } from '../../../classes/learned-letters';
import { MatAccordion        } from '@angular/material';
import { DetectMobileService } from '../../../services/detect-mobile.service';

@Component({
  selector: 'app-learned-letters',
  templateUrl: './learned-letters.component.html',
  styleUrls: ['./learned-letters.component.css']
})
export class LearnedLettersComponent implements OnInit {

  @Input() learneds:     LearnedLetters[];
  @Input() combinations:    {};
  @Input() sortedState:     {};
  @Input() sortRatingState: boolean;
  @Input() sortAlphaState:  boolean;

  @Output() evOpenItem    = new EventEmitter<string>();
  @Output() evcloseItem   = new EventEmitter<string>();
  @Output() evSortRating  = new EventEmitter<boolean>();
  @Output() evSortAlpha   = new EventEmitter<boolean>();
  @Output() evRepractice  = new EventEmitter<string>();

  @Output() evlistenLetter    = new EventEmitter<{}>();
  @Output() evlistenSyllable  = new EventEmitter<string>();

  @ViewChild(MatAccordion) accordion: MatAccordion;
  multi: boolean;

  constructor( private _mobile: DetectMobileService ) { }

  ngOnInit() {}


  noLearneds = () => {
    return this.learneds.length === 0 ? true : false;
  }


  countStars = (rating: number) => {

    const t = [];
    for (let i = 0; i < rating; i++) { t.push(''); }
    return t;

  }


  itemOpened = (letter: string) => {
    this.evOpenItem.emit(letter.toString());
  }


  itemClosed = (letter: string) => {
    this.evcloseItem.emit(letter.toString());
  }


  sortRating = () => {
    this.closeAllExpansion();
    this.evSortRating.emit(true);
  }


  sortAlpha = () => {
    this.closeAllExpansion();
    this.evSortAlpha.emit(true);
  }


  closeAllExpansion = () => {
    this.multi = true;
    setTimeout(() => (this.accordion.closeAll(), this.multi = false), 0);
  }


  isMobile = () => {
    return this._mobile.isMobile();
  }

  listenLetter = (letter: string, type: string) => {
    this.evlistenLetter.emit({code: 'letter', letter, type});
  }

  listenCombination = (syllableP: string, syllableW: string, letter: string ) => {
    this.evlistenLetter.emit({code: 'combinations', syllableP, syllableW, letter});
  }

  repractice = (letter: string) => {
    this.evRepractice.emit(letter);
  }

}
