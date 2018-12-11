import { Component, OnInit, Input, EventEmitter, Output   } from '@angular/core';
import { DetectMobileService } from '../../../services/detect-mobile.service';

@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.css']
})
export class AlphabetComponent implements OnInit {

  @Input()  letters:      any;
  @Input()  selections:   {};
  @Input()  wordsUrl:     {};
  @Input()  contGrid:     HTMLDivElement;
  @Output() evsAlphabet    = new EventEmitter<string>();
  @Output() evsSoundLetter = new EventEmitter<string>();

  constructor(
    private _mobile: DetectMobileService
  ) { }

  ngOnInit() {}


  isMobile = () => {
    return this._mobile.isMobile();
  }


  openModal = (letter: string) => {
    this.evsAlphabet.emit(letter);
  }


  getImage = (letter) => {
    return `/assets/img100X100/${this.wordsUrl[letter]}-min.png`;
  }


  listenLetter = (letter: string) => {
    this.evsSoundLetter.emit(letter);
  }


  genCols = (el: HTMLDivElement) => {

    if ( this.isMobile() ) {

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

    if ( !this.isMobile() ) {

      const width = el.clientWidth;

      if ( width > 500 ) {

        return ({ 'grid-template-columns': `repeat(auto-fill, ${width * 0.75}px)` });

      }

      if ( width < 500 ) {

        return ({ 'grid-template-columns': `repeat(auto-fill, ${width * 0.95}px)` });

      }
    }

  }


}
