import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { SpeechSynthesisService  } from '../../services/speech-synthesis.service';
import { DetectMobileService     } from '../../services/detect-mobile.service';
import { GenerateDatesService    } from '../../services/generate-dates.service';
import { GetDataService          } from '../../services/get-data.service';
import { SendDataService         } from '../../services/send-data.service';
import { PreloadAudioService     } from '../../services/preload-audio.service';
import { LocalStorageService     } from '../../services/local-storage.service';
import { ShuffleService          } from '../../services/shuffle/shuffle.service';
import { GenerateIdsService      } from '../../services/generate-ids/generate-ids.service';
import { SimilarLetters          } from '../../interfaces/words-and-letters';
import { FindLetterData, Selection   } from '../../interfaces/find-letter-data';



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
  lettersOPt:     string[] = [];
  selections:     string[] = [];
  sel1 =          '';
  sel2 =          '';
  loading =       true;
  show:           boolean;
  userData:       FindLetterData   = {};
  Data:           FindLetterData[] = [];
  similarLetters: SimilarLetters;
  idOPtions:      {};
  currentIds:     string[];

  constructor(
    private router:   Router,
    private _shuffle: ShuffleService,
    private _route:   ActivatedRoute,
    private getData:  GetDataService,
    private sendData: SendDataService,
    private _ids:     GenerateIdsService,
    private _audio:   PreloadAudioService,
    private _storage: LocalStorageService,
    private dMobile:  DetectMobileService,
    private genDates: GenerateDatesService,
    private speech:   SpeechSynthesisService,

  ) {
    this.letterParam    = this._route.snapshot.paramMap.get('letter');
    this.similarLetters = this._storage.getElement(`${this.letterParam.toLowerCase()}_sl`);
    this.lettersOPt     = this.fillLetters();
    this.currentLetter  = this.lettersOPt[0];
    this.idOPtions      = this.fillLettersIds();
    this.currentIds     = this.idOPtions[this.currentLetter];
    this.show           = true;
  }

  ngOnInit() {
    this.showContainer = true;
    this.showTarget    = true;
    this._audio.loadAudio();
    this.listenMsg();

    (window).addEventListener('resize', e => this.style(this.card.nativeElement));
    // this.initUserData();
  }

  fillLettersIds = () => {
    const t = {};

    t[`${this.letterParam.toLowerCase()}`] = this.setData(this.letterParam.toLowerCase());
    t[`${this.letterParam.toUpperCase()}`] = this.setData(this.letterParam.toUpperCase());

    return JSON.parse(JSON.stringify(t));
  }

  fillLetters = () => [this.letterParam.toUpperCase(), this.letterParam.toLowerCase()];

  setData = (letter: string) => {

    let sLetters = [];
    const s = letter === letter.toLowerCase()
                                              ? sLetters = this.similarLetters[letter.toLowerCase()]
                                              : sLetters = this.similarLetters[letter.toUpperCase()];

    const lettersMixed = this._shuffle.shuffle(sLetters, letter, 2);
    const lettersIDs   = this._ids.generateIDs(lettersMixed);

    return lettersIDs;

  }


  instructions = () => {

    this.canPlayGame = false;
    this.show        = true;

    const type   = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const letter = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam];

    const msg    = `Encuentra la pareja de letras: ${letter}.. "${type}"`;
    const speak  = this.speech.speak(msg);

    speak.addEventListener('end', e => ( this.canPlayGame = true, this.show = false));

  }

  isMobile = (): boolean => this.dMobile.isMobile();







  /*----- End Style of elements -----*/




  onSelect = (id: string) => {

    if (this.canPlayGame) {

      this.listenValidationOfSelection(id[0], this.currentLetter);

      this.active = true;
      const index = this.selections.indexOf(id);

      if (index === -1) {

        this.selections.push(id);

        if (this.selections.length === 1) {

          this.sel1 = id;
          // this.addSelection(this.sel1[0]);

        }

        if (this.selections.length === 2) {

          this.sel2 = id;
          // this.addSelection(this.sel2[0]);
          // this.addCouples(this.sel1[0], this.sel2[0]);
          this.canPlayGame = false;
          const validation = this.sel1[0] === this.sel2[0] ? setTimeout(e => this.next(), 2000) : this.reset();

        }
      }
    }
  }

  listenValidationOfSelection = (letter: string, letterToVal: string) => {

    const sound = JSON.parse(localStorage.getItem('letter_sounds'))[letter.toLowerCase()];
    const typeL = letterToVal === letterToVal.toLowerCase() ? 'minúscula' : 'mayúscula';

    const msg   = `${sound} '${typeL}'`;
    const playR = letter === letterToVal ? this.speech.speak(msg, .95) : this._audio.playAudio();
  }

  next = () => {

    // this.addFinalTime();

    const index = this.lettersOPt.indexOf(this.currentLetter);

    if (index === 0) {

      this.showTarget    = true;
      this.hideTarget    = false;
      this.show          = true;
      this.reset();
      this.currentLetter = this.lettersOPt[index + 1];
      this.currentIds    = this.idOPtions[this.currentLetter];

      this.listenMsg();

    } else {

      this.redirect();

    }
  }

  changeData = () => {
  }

  redirect = () => {

    // this.sendFindLetterData();

    this.success = true;

    const url    = `/lectura/juego/${this.letterParam}`;
    const msg    = `Bien Hecho`;
    const speech = this.speech.speak(msg, .8);
    speech.addEventListener('end', e => this.router.navigateByUrl(url));

  }

  listen = () => {

    const type = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const letter = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLocaleLowerCase()];

    const msg = `${letter} ${type}`;
    this.speech.speak(msg, 1);

  }

  reset = () => {
    setTimeout(() => (this.sel1 = '', this.sel2 = '', this.active = false, this.selections = []), 1200);
    setTimeout(() => this.canPlayGame = true, 1500);
  }


/*----- Collect User data -----*/

  initUserData = () => {
    const t = this.genDates.generateData();

    this.userData.user_id   = 'N/A';
    this.userData.date      = t.fullDate;
    this.userData.startTime = t.fullTime;
    this.userData.finalTime = 'N/A';
    this.userData.letter    = this.currentLetter;
    this.userData.pattern   = this.fillOtions();
    this.userData.fails     = 0;
    this.userData.couples   = [];
    this.userData.historial = [];
  }

  fillOtions = (): string[] => {

    const t = [];
    this.currentIds.forEach(el => t.push(el[0]));

    return JSON.parse(JSON.stringify(t));

  }

  addCouples = (letter1: string, letter2: string) => {

    const x = [letter1, letter2];
    this.userData.couples.push(x);

  }

  addSelection = (letter: string) => {

    const state   = letter === this.currentLetter ? true : false;
    const addFail = state === false ? this.userData.fails++ : false;
    const t       = this.genDates.generateData();

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




  continue = () => {

    this.hideTarget = true;
    setTimeout(e => this.showTarget = false, 500);

    this.instructions();
  }

  listenMsg = () => {

    const t    = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLowerCase()];
    const type = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msg  = `Esta es la letra: ... ${t} ... ${type}`;

    setTimeout(e => this.speech.speak(msg), 500);

  }

  listenLetter = () => {

    const t    = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLowerCase()];
    const type = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msg  = `${t} ... ${type}`;

    this.speech.speak(msg, 0.9);

  }

  /*----- calculate styles of elements  -----*/
  style = (el: HTMLElement) => {

    const width  = el.clientWidth;
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

  calcOpt = (el: HTMLElement) => ({ 'width': `${el.clientWidth * .332}px`, 'height': `${el.clientWidth * .332}px` });

  calcFZ = (el: HTMLElement) => {
    const widthOPt = el.clientWidth;
    return { 'font-size': `${widthOPt * .5}px` };

  }
}
