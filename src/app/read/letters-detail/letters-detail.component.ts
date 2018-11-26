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
import { SimilarLetters          } from '../../classes/initial-data';
import {
  LettersDetailData,
  MemoryGame,
  CardExample,
  Couples,
  Historial
} from '../../classes/letters-detail-data';



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
  userData:       LettersDetailData;
  Data:           LettersDetailData[] = [];
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
    this.initUserData();
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

  onSelect = (id: string) => {

    if (this.canPlayGame) {

      this.listenValidationOfSelection(id[0], this.currentLetter);

      this.active = true;
      const index = this.selections.indexOf(id);

      if (index === -1) {

        this.selections.push(id);

        if (this.selections.length === 1) {

          this.sel1 = id;
          this.addDataToMemoryGame(3044, this.sel1[0]);

        }

        if (this.selections.length === 2) {

          this.sel2 = id;
          this.addDataToMemoryGame(3044, this.sel2[0]);
          this.addDataToMemoryGame(3043, this.sel1[0], this.sel2[0]);

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

    this.addDataToMemoryGame(3041);
    this.Data.push(JSON.parse(JSON.stringify(this.userData)));

    const index = this.lettersOPt.indexOf(this.currentLetter);

    if (index === 0) {

      this.showTarget    = true;
      this.hideTarget    = false;
      this.show          = true;
      this.reset();
      this.currentLetter = this.lettersOPt[index + 1];
      this.currentIds    = this.idOPtions[this.currentLetter];


      this.initUserData();
      this.listenMsg();

    } else {

      this.redirect();

    }
  }

  changeData = () => {
  }

  redirect = () => {

    this.sendDataToServer();

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

  continue = () => {

    this.addDataToCardExample(2042);
    this.hideTarget = true;
    this.addDataToMemoryGame(3040);
    setTimeout(e => this.showTarget = false, 500);

    this.instructions();

  }

  listenMessage = () => {

    this.addDataToCardExample(2040);
    this.listenMsg();

  }

  listenMsg = () => {

    const t    = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLowerCase()];
    const type = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msg  = `Esta letra es la ... ... ${t} ... ${type}`;

    setTimeout(e => this.speech.speak(msg, .85), 500);

  }

  listenLetter = () => {
    this.addDataToCardExample(2041);
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


/*----- Collect User data -----*/

  initUserData = () => {

    const t  = this.genDates.generateData();
    const id = this._storage.getElement('user')['userId'];
    const cE = new CardExample(t.fullTime, 'N/D', [], []);
    const mG = new MemoryGame('N/D', 'N/D', this.currentIds, [], []);

    this.userData = new LettersDetailData(id, this.currentLetter, t.fullDate, t.fullTime, 'N/D', cE, mG);
  }

  addDataToCardExample = (code: number) => {

    const path = this.userData.cardExample;
    const t    = this.genDates.generateData().fullTime;

    switch (code) {
      case 2040:
        path.listenMsg.push(t);
        break;
      case 2041:
        path.listenLetter.push(t);
        break;
      case 2042:
        path.finalTime = t;
        break;
      default:
        break;
    }

  }

  addFinalTime = () => {
    this.userData.finalTime = this.genDates.generateData().fullTime;
  }

  addDataToMemoryGame = (code: number, fLetter?: string, sLetter?: string) => {

    const path = this.userData.memoryGame;
    const t = this.genDates.generateData().fullTime;

    switch (code) {
      case 3040:
        path.startTime = t;
        break;
      case 3041:
        path.finalTime = t;
        this.addFinalTime();
        break;
      case 3043:
        const x = new Couples(fLetter, sLetter);
        path.couples.push(x);
        break;
      case 3044:
        const s = fLetter === this.currentLetter ? true : false;
        const h = new Historial(t, fLetter, s);
        path.historial.push(h);
        break;
      default:
        break;
    }

  }

  sendDataToServer = () => {
    console.log(this.Data);
  }




}
