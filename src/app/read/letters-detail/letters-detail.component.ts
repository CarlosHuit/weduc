import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { DetectMobileService } from '../../services/detect-mobile.service';
import { GenerateDatesService } from '../../services/generate-dates.service';
import { GetDataService, SimilarLetters } from '../../services/get-data.service';
import { SendDataService } from '../../services/send-data.service';
import { PreloadAudioService } from '../../services/preload-audio.service';

export interface FindLetter {
  user_id?: string;
  date?: string;
  startTime?: string;
  finalTime?: string;
  pressLetter?: string[];
  letter?: string;
  pattern?: string[];
  fails?: number;
  couples?: string[][];
  historial?: Selection[];
}

export interface Selection {
  time?: string;
  letter?: string;
  state?: boolean;
}

@Component({
  selector: 'app-letters-detail',
  templateUrl: './letters-detail.component.html',
  styleUrls: ['./letters-detail.component.css']
})
export class LettersDetailComponent implements OnInit {


  @ViewChild('card') card: ElementRef;

  active:         boolean;
  success:        boolean;
  canPlayGame:    boolean;
  hideTarget:     boolean;
  showTarget:     boolean;
  showContainer:  boolean;
  letterParam:    string;
  currentLetter:  string;
  lettersIDs:     string[];
  lettersOPt:     string[] = [];
  selections:     string[] = [];
  sel1 =          '';
  sel2 =          '';
  loading =       true;
  show =          true;
  userData:       FindLetter   = {};
  Data:           FindLetter[] = [];
  similarLetters: SimilarLetters;


  constructor(
    private router:   Router,
    private _route:   ActivatedRoute,
    private getData:  GetDataService,
    private speech:   SpeechSynthesisService,
    private dMobile:  DetectMobileService,
    private genDates: GenerateDatesService,
    private sendData: SendDataService,
    private _audio:   PreloadAudioService
  ) {
    this.letterParam = this._route.snapshot.paramMap.get('letter');
  }

  ngOnInit() {
    this.setValues();
    this._audio.loadAudio();
    setTimeout(() => {
      this.showContainer = true;
    }, 10);
    this.showTarget = true;
  }

  setValues = () => {
    this.getData.getSimilarLetters(this.letterParam)
      .subscribe(
        (result: SimilarLetters) => {
          this.similarLetters = result;
          this.fillOPts();
          this.setData(this.currentLetter);
          this.loading = false;
          this.initUserData();

          this.listenMsg();
          (window).addEventListener('resize', e => this.style(this.card.nativeElement));
        },
        (err) => console.log(err)
      );
  }


  fillOPts = () => {
    this.lettersOPt.push(this.letterParam.toUpperCase());
    this.lettersOPt.push(this.letterParam.toLowerCase());
    this.currentLetter = this.lettersOPt[0];
  }

  instructions = () => {

    this.canPlayGame = false;
    const type = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const letter = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLocaleLowerCase()];
    const msg = `Encuentra la pareja de letras: ${letter}.. "${type}"`;


    const speak = this.speech.speak(msg).addEventListener('end', e => {
      this.show = false;
      this.canPlayGame = true;
    });

  }

  isMobile = (): boolean => this.dMobile.isMobile();


  /*----- Style of elementes  -----*/

  style = (el: HTMLElement) => {
    const width = el.clientWidth;
    const height = el.clientHeight;

    if (width > height) {
      return {
        'width':  `${height * .85}px`,
        'height': `${height * .85}px`
      };
    } else {
      return {
        'width':  `${width * .85}px`,
        'height': `${width * .85}px`
      };
    }


  }

  calcOpt = (el: HTMLElement) => {
    const wEl = el.clientWidth;
    return {
      'width': `${wEl * .332}px`,
      'height': `${wEl * .332}px`
    };
  }


  /*----- End Style of elements -----*/

  setData = (letter: string) => {

    let sLetters = [];
    const s = letter === letter.toLowerCase() ? sLetters = this.similarLetters['lowerCase'] : sLetters = this.similarLetters['upperCase'];
    const lettersMixed = this.shuffle(sLetters, letter);
    const lettersIDs = this.generateIDs(lettersMixed);

    this.lettersIDs = lettersIDs;
  }

  shuffle = (arr: string[], letter: string) => {

    const array = arr;
    array.push(letter);
    array.push(letter);

    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;

    }

    return array;
  }

  generateIDs = (array: string[]) => {
    const data = array;

    for (let i = 0; i < data.length; i++) {
      const element = `${data[i]}${i}`;
      data[i] = element;
    }
    return JSON.parse(JSON.stringify(data));
  }

  onSelect = (id: string) => {

    if (this.canPlayGame) {

      const sound = JSON.parse(localStorage.getItem('letter_sounds'))[id[0].toLowerCase()];
      const typeL = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
      const msg = `${sound} '${typeL}'`;

      const playR = id[0] === this.currentLetter ? this.speech.speak(msg, .95) : this._audio.playAudio();

      this.active = true;
      const index = this.selections.indexOf(id);

      if (index === -1) {

        this.selections.push(id);

        if (this.selections.length === 1) {
          this.sel1 = id;
          this.addSelection(this.sel1[0]);
        }

        if (this.selections.length === 2) {

          this.sel2 = id;
          this.addSelection(this.sel2[0]);
          this.addCouples(this.sel1[0], this.sel2[0]);

          const validation = this.sel1[0] === this.sel2[0] ? setTimeout(e => this.next(), 1500) : this.reset();

        }
      }
    }
  }

/*   next = () => {
    this.success = true;
    this.addFinalTime();
    this.reset();
    this.show = true;

    const index = this.lettersOPt.indexOf(this.currentLetter);

    if (index === 0) {
      this.currentLetter = this.lettersOPt[index + 1];
      this.setData(this.currentLetter);

      this.speech.speak('Bien Hecho', .8).addEventListener('end', () => {
        this.success = false;
        this.initUserData();
        this.instructions();
      });

    } else {
      this.redirect();
    }
  } */

  changeData = () => {
  }

  redirect = () => {

    // this.sendFindLetterData();

    const url = `/leer/target/${this.letterParam}`;
    const letter = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLowerCase()];
    const msg = `Bien... es momento de aprender a usar la letra: ${letter} `;
    const speech = this.speech.speak(msg, .9).addEventListener('end', e => this.router.navigateByUrl(url));


  }

  listen = () => {

    const type = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const letter = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLocaleLowerCase()];

    const msg = `${letter} ${type}`;
    this.speech.speak(msg, 1);

  }

  reset = () => {
    setTimeout(() => {
      this.sel1 = '';
      this.sel2 = '';
      this.active = false;
      this.selections = [];
    }, 1200);
  }

  initUserData = () => {
    const t = this.genDates.generateData();

    this.userData.user_id = 'N/A';
    this.userData.date = t.fullDate;
    this.userData.startTime = t.fullTime;
    this.userData.finalTime = 'N/A';
    this.userData.letter = this.currentLetter;
    this.userData.pattern = this.fillOtions();
    this.userData.fails = 0;
    this.userData.couples = [];
    this.userData.historial = [];
  }

  fillOtions = (): string[] => {
    const t = [];
    this.lettersIDs.forEach(el => t.push(el[0]));
    return JSON.parse(JSON.stringify(t));
  }

  addCouples = (letter1: string, letter2: string) => {
    const x = [letter1, letter2];
    this.userData.couples.push(x);
  }

  addSelection = (letter: string) => {

    const state = letter === this.currentLetter ? true : false;
    const addFail = state === false ? this.userData.fails++ : false;
    const t = this.genDates.generateData();

    const x: Selection = { time: t.fullTime, letter: letter, state: state };
    this.userData.historial.push(x);


  }

  addFinalTime = () => {
    const t = this.genDates.generateData();
    this.userData.finalTime = t.fullTime;
    this.addUserDataAndReset();
  }

  addUserDataAndReset = () => {
    const x = JSON.parse(JSON.stringify(this.userData));
    this.Data.push(x);
  }

  resetUserData = () => {
    this.userData = {};
  }

  // sendFindLetterData = () => {
  //   this.sendData.sendFindLetterData(this.Data)
  //     .subscribe(
  //       res => console.log(res),
  //       err => console.log(err)
  //     );
  // }


  calcFZ = (el: HTMLElement) => {
    const widthOPt = el.clientWidth;
    return { 'font-size': `${widthOPt * .5}px` };
  }

  next = () => {
    this.hideTarget = true;
    this.speech.cancel();
    setTimeout(e => this.showTarget = false, 500);
    // setTimeout(e => this.hideTarget = false, 1500);
  }

  listenMsg = () => {
    const t = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLowerCase()];
    const type = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msg = `Esta es la letra: ... ${t} ... ${type}`;
    this.speech.speak(msg);
  }

  listenLetter = () => {
    const t = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLowerCase()];
    const type = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msg = `${t} ... ${type}`;
    this.speech.speak(msg, 0.9);
  }


}
