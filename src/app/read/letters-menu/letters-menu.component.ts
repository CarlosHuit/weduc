import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Router                 } from '@angular/router';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { GenerateDatesService   } from '../../services/generate-dates.service';
import { GetDataService         } from '../../services/get-data.service';
import { SendDataService        } from '../../services/send-data.service';
import { DetectMobileService    } from '../../services/detect-mobile.service';
import { LocalStorageService    } from '../../services/local-storage.service';
import { MenuData, Selection    } from '../../interfaces/menu-data';
import { WordsAndLetters, LearnedLetters } from '../../interfaces/words-and-letters';
import { MatAccordion           } from '@angular/material';


@Component({
  selector: 'app-letters-menu',
  templateUrl: './letters-menu.component.html',
  styleUrls: ['./letters-menu.component.css']
})

export class LettersMenuComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  @ViewChild('containerDetail') containerDetail: ElementRef;
  @ViewChild(MatAccordion)      accordion:       MatAccordion;

  styles: {};
  @ViewChild('contGrid') contGrid: ElementRef;
  data:           WordsAndLetters;
  userData:       MenuData = {};
  learneds:       LearnedLetters[];
  letters:        string[] = [];
  words:          string[] = [];
  storage:        boolean;
  selected:       boolean;
  showC:          boolean;
  speaking:       boolean;
  multi:          boolean;
  closeExpansion: boolean;
  currentLetter:  string;

  loading         = true;
  showModal       = false;
  showAlphabet    = true;
  combinations:     {};

  count           = 0;
  soundsLetters   = {};
  selections      = {};
  wordsUrl        = {};
  highlightLetter = {};
  sortAlphaState  = true;
  sortRatingState = false;
  sortedState     = {alpha: true, rating: false };

  constructor(
    private speechSynthesis:   SpeechSynthesisService,
    private genDate:           GenerateDatesService,
    private detMobile:         DetectMobileService,
    private _storage:          LocalStorageService,
    private getData:           GetDataService,
    private sendData:          SendDataService,
    private router:            Router,
  ) {
    this.combinations    = this._storage.getElement('combinations');
  }

  ngOnInit() {

    this.getData.getWordsAndLetters()
      .subscribe(
        (data: WordsAndLetters) => {
          this.data = data;
          this.setInitialData(this.data);
          this.instructions('y');
          // this.addInitialTime();

          (window as any).onresize = () => (this.genCols(this.contGrid.nativeElement), this.isMobile());

        },
        err => console.log(err)
      );

  }


  ngOnDestroy() {
    this.speechSynthesis.cancel();
    window.removeEventListener('resize', () => (this.genCols(this.contGrid.nativeElement), this.isMobile()));
  }


  isMobile = (): boolean =>  this.detMobile.isMobile();


  setInitialData = (data: WordsAndLetters) => {


    const words          = data.words;
    const letters        = data.letters;
    const learnedLetters = data.learnedLetters;

    /* Se selecciona la imagen */
    words.forEach(e => this.wordsUrl[e.l] = e.w[this.randomInt(0, e.w.length)]);

    this.learneds       = this.sortLearnedLetters(learnedLetters);
    this.letters        = this.deleteLearnedLetters(letters.alphabet, this.learneds);
    this.combinations   = letters.combinations;
    this.soundsLetters  = letters.sound_letters;

    this.loading = false;
    setTimeout(() =>  this.showC = true, 10);

  }


  deleteLearnedLetters = (alphabet: string, learneds: LearnedLetters[]) => {

    const nAlph = alphabet.split('');
    learneds.forEach(x => nAlph.indexOf(x.letter) > -1 ? nAlph.splice(nAlph.indexOf(x.letter), 1) : false);
    return nAlph;

  }


  sortLearnedLetters = (learneds: LearnedLetters[]) => {
    learneds.sort( (a, b) => {

      if (a.letter > b.letter) { return  1; }
      if (a.letter < b.letter) { return -1; }

      return 0;
    });

    return learneds;
  }


  noLearneds = () => {
    return this.learneds.length === 0 ? true : false;
  }


  goToAlphabet = () => {
    this.showAlphabet = true;
    this.instructions('y');
  }


  goToLearnedLetters = () => {

    this.showAlphabet = false;
    const msg1 = 'Aquí aparecerán las letras que vayas aprendiendo';
    const msg2 = 'Estas son las letras que has aprendido';
    const msg  = this.noLearneds() ? msg1 : msg2;

    this.speechSynthesis.speak(msg, 0.9);

  }


  listenCombination = (syllable: string) => {
    const speech = this.speechSynthesis.speak(syllable, .8);
  }


  sortAlpha = () => {

    this.closeAllExpansion();

    this.sortRatingState    = false;
    this.sortedState.alpha  = true;
    this.sortedState.rating = false;

    if (!this.sortAlphaState) {

      this.learneds.sort((a, b) => {

        if (a.letter > b.letter) { return 1; }
        if (a.letter < b.letter) { return -1; }
        return 0;
      });

      this.sortAlphaState  = !this.sortAlphaState;

    } else {

      this.learneds.sort((b, a) => {

        if (a.letter > b.letter) { return 1; }
        if (a.letter < b.letter) { return -1; }

        return 0;
      });

      this.sortAlphaState = !this.sortAlphaState;

    }
  }


  getCombinations = (letter: string) => {
    console.log(this._storage.getElement('combinations')[letter.toLowerCase()]);
    return this._storage.getElement('combinations')[letter.toUpperCase()];
  }


  sortRating = () => {

    this.closeAllExpansion();

    this.sortAlphaState     = false;
    this.sortedState.alpha  = false;
    this.sortedState.rating = true;

    if (!this.sortRatingState) {

      this.learneds.sort((a, b) =>  b.rating - a.rating);
      this.sortRatingState = !this.sortRatingState;

    } else {

      this.learneds.sort((b, a) =>  b.rating - a.rating);
      this.sortRatingState = !this.sortRatingState;

    }
  }


  closeAllExpansion = () => {
    this.multi = true;
    setTimeout(() => (this.accordion.closeAll(), this.multi = false), 0);
  }


  getImage = (letter) => {
    return `/assets/img100X100/${this.wordsUrl[letter]}-min.png`;
  }


  genUrl = (word: string) => {
    return `/assets/img100X100/${word}-min.png`;
  }


  instructions = (type?: string) => {

    const msg1 = `Este es el abecedario. Selecciona una letra para continuar.`;
    const msg2 = 'El abecedario';
    const msg = type ? msg1 : msg2;

    const speech = this.speechSynthesis.speak(msg);

  }


  countStars = (rating: number) => {
    const t = [];
    for (let i = 0; i < rating; i++) {
      t.push('');
    }

    return t;
  }


  randomInt = (min = 0, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }


  listenSoundLetter = (letter: string) => {

    const t = JSON.parse(localStorage.getItem('letter_sounds'))[letter.toLowerCase()];
    this.speechSynthesis.speak(t, .8);

  }


  listenLetter = (letter: string, type: string) => {

    this.speaking = true;
    this.highlightLetter[letter] = letter;
    this.highlightLetter['type'] = type;

    const lSound = this._storage.getElement('letter_sounds')[letter];
    const lType  = type === 'l' ? 'minúscula' : 'mayúscula';
    const msg    = `${lSound} ... ${lType}`;

    const speech = this.speechSynthesis.speak(msg, 0.8);
    speech.addEventListener('end', () => (this.highlightLetter = {}, this.speaking = false));

  }


  listenWord = (letter: string) => {

    const lSound = this._storage.getElement('letter_sounds')[letter];
    const word   = this.wordsUrl[letter.toLowerCase()].toLowerCase();

    if ( word[0] === letter.toLowerCase() ) {

      const msg    = `${word} ... comienza con la letra ... ${lSound}`;
      const speech = this.speechSynthesis.speak(msg, .95);

    }

    const lower = new RegExp(letter.toLowerCase().trim());

    if ( word[0] !== letter.toLowerCase() && lower.test(word) ) {
      const speech = `${word} contiene la letra ... ${lSound}`;
    }

  }


  openModal = (letter: string) => {
    return !this.selected ? this.redirect(letter) : null;
  }


  redirect = (letter: string) => {

    this.selected = true;
    this.selections[letter] = letter;

    const msg    = `Bien, Seleccionaste la letra: ... ${this.soundsLetters[letter]}`;
    const speech = this.speechSynthesis.speak(msg, .95);
    const url    = `lectura/detalle-letra/${letter}`;

    speech.addEventListener('end', () => this.router.navigateByUrl(url));
  }


  repractice = (letter: string) => {

    const url = `lectura/detalle-letra/${letter.toLowerCase()}`;
    this.router.navigateByUrl(url);

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

  /*

    addInitialTime = (): void => {

      const initialTime = this.genDate.generateData();

      this.userData['user_id']    = 'N/A';
      this.userData['initTime']   = initialTime.fullTime;
      this.userData['date']       = initialTime.fullDate;
      this.userData['selection']  = [];
      this.userData['successTime'] = 'N/A';

    }


    addInfoSelection = (letter: string) => {

      const openModalTime = this.genDate.generateData();

      const x: Selection = {
        letter:        letter,
        openModalTime: openModalTime.fullTime,
        letterUpper:   0,
        letterLower:   0,
        words:          this.fillWords(),
        cancelTime:    'N/A',
      };

      const index = this.userData.selection.length;
      this.userData.selection[index] = x;

    }

    fillWords = () => {

      const t = {};
      this.words.forEach( word => t[word] = 0 );

      return JSON.parse(JSON.stringify(t));

    }

    countLetterUpper = () => {
      const index = this.userData.selection.length - 1;
      const r     = this.userData.selection[index].letterUpper += 1;
    }

    countLetterLower = () => {
      const index = this.userData.selection.length - 1;
      const r     = this.userData.selection[index].letterLower += 1;
    }

    addCountToWord = (word: string) => {
      const index = this.userData.selection.length - 1;
      const t     = this.userData.selection[index].words[word] += 1;
    }

    addCountToSyllable = (syllable: string) => {
      const index = this.userData.selection.length - 1;
      const t     = this.userData.selection[index].syllables[syllable] += 1;
    }

    addCancelTime = () => {
      const i = this.userData.selection.length - 1;
      const cancelTime = this.genDate.generateData();

      const t = this.userData.selection[i].cancelTime = cancelTime.fullTime;
    }

    addSuccessTime = () => {
      const successTime = this.genDate.generateData();
      this.userData['successTime'] = successTime.fullTime;
    }

    send = () => {
      this.sendData.sendMenuData(this.userData)
      .subscribe(
        e  =>  { const x = e;   },
        err => { const x = err; }
      );
    }

    */


}
