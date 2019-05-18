import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FLData } from 'src/app/store/models/reading-course/find-letter/reading-course-find-letter.model';

@Component({
  selector: 'app-find-letter-card',
  templateUrl: './find-letter-card.component.html',
  styleUrls: ['./find-letter-card.component.css']
})
export class FindLetterCardComponent implements OnInit, OnDestroy {

  @Input() data: FLData;
  @Input() onPressImage: Function;
  @Input() onPressOption: Function;
  @Input() wrongSelections: {};
  @Input() correctSelections: {};
  @Input() selections: {};
  @Input() disableAll: boolean;

  @ViewChild('mcWord') mcWord: ElementRef;

  buttonStyle: {'min-width': string, 'font-size': string };

  constructor() { }


  ngOnInit() {

    this.setInitialStyles();
    window.addEventListener('resize', this.setInitialStyles);

  }


  ngOnDestroy() {

    window.removeEventListener('resize', this.setInitialStyles);

  }


  setInitialStyles = async () => {

    await new Promise((r, w) => setTimeout(() =>  r(null), 0));
    this.buttonStyle = this.genStyles(this.mcWord.nativeElement);

  }


  genStyles = (el: HTMLDivElement) => {

    const maxLetters  = this.data.word.length;

    const cWidth  = window.innerWidth;
    const cHeight = window.innerHeight;
    const margin = maxLetters * 2.5;

    const w       = el.clientWidth;
    const portrait = cHeight > cWidth ? true : false;

    if ( portrait && cWidth < 540 ) {

      if (maxLetters <= 4) {

        return {
          'min-width': '55px',
          'font-size': '55px'
        };

      } else if ( maxLetters > 4 && maxLetters <= 6 ) {

        const minWidth = ((w * 0.8 ) - margin) / maxLetters;
        return {
          'min-width': `${minWidth}px`,
          'font-size': '50px'
        };

      } else if (maxLetters === 7 ) {

        const minWidth = ( w / 8 );

        return {
          'min-width': `${minWidth}px`,
          'font-size': '45px'
        };

      } else if (maxLetters > 7 ) {


        const minWidth = (w - margin) / maxLetters;

        return {
          'min-width': `${minWidth}px`,
          'font-size': '35px'
        };


      }

    }

    if (cHeight < cWidth) {

      if (maxLetters <= 6) {

        return { 'min-width': `45px`, 'font-size': `${w * 0.135}px` };

      } else {

        return { 'min-width': `38px`, 'font-size': `${w * 0.10}px` };

      }

    }

  }

}
