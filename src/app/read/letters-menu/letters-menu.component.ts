import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Router                 } from '@angular/router';
import { MatAccordion           } from '@angular/material';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { GenerateDatesService   } from '../../services/generate-dates.service';
import { GetInitialDataService  } from '../../services/get-data/get-initial-data.service';
import { SdLettersMenuService   } from '../../services/send-user-data/sd-letters-menu.service';
import { DetectMobileService    } from '../../services/detect-mobile.service';
import { LocalStorageService    } from '../../services/local-storage.service';
import { InitialData            } from '../../classes/initial-data';
import { LearnedLetters         } from '../../classes/learned-letters';
import {
  MenuLettersData,
  TabAlphabet,
  Times,
  LettersHeard,
  TabLearnedLetters,
  Sort,
  PreviewLetter,
  Syllable
} from '../../classes/menu-letters-data';


@Component({
  selector: 'app-letters-menu',
  templateUrl: './letters-menu.component.html',
  styleUrls: ['./letters-menu.component.css']
})

export class LettersMenuComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  @ViewChild('containerDetail') containerDetail: ElementRef;
  @ViewChild('contGrid')        contGrid:        ElementRef;
  @ViewChild(MatAccordion)      accordion:       MatAccordion;

  data:           InitialData;
  learneds:       LearnedLetters[];
  userData:       MenuLettersData;
  letters:        string[] = [];
  words:          string[] = [];
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
    private getData:           GetInitialDataService,
    private _sendData:         SdLettersMenuService,
    private router:            Router,
  ) {
    this.combinations    = this._storage.getElement('combinations');
  }

  ngOnInit() {

    this.getData.getInitialData()
      .subscribe(
        (data: InitialData) => {

          this.data = data;
          this.setInitialData(this.data);
          this.instructions('y');

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



  setInitialData = (data: InitialData) => {

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
    this.initUserData();
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

    this.deactiveTabLearned();
    this.activeTabAlphabet();
    this.showAlphabet = true;
    this.instructions('y');
  }


  goToLearnedLetters = () => {

    this.activeTabLearned();
    this.deactiveTabAlphabet();
    this.showAlphabet = false;

    const msg1 = 'Aquí aparecerán las letras que vayas aprendiendo';
    const msg2 = 'Estas son las letras que has aprendido';
    const msg  = this.noLearneds() ? msg1 : msg2;

    this.speechSynthesis.speak(msg, 0.9);

  }


  listenCombination = (syllableP: string, syllableW: string, letter: string ) => {
    const speech = this.speechSynthesis.speak(syllableP, .8);
    this.AddListeningsCount(letter, 's', syllableW);
  }


  sortAlpha = () => {

    this.addSortingCount('alphabet');
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
    return this._storage.getElement('combinations')[letter.toUpperCase()];
  }


  sortRating = () => {

    this.addSortingCount('rating');
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
    for (let i = 0; i < rating; i++) { t.push(''); }
    return t;

  }


  randomInt = (min = 0, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }


  listenSoundLetter = (letter: string) => {
    this.addLettersHeard(letter);
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

    if (type === 'l') { this.AddListeningsCount(letter, 'l'); }
    if (type === 'u') { this.AddListeningsCount(letter, 'u'); }

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
    this.addTimePracticeLetter(letter);
    return !this.selected ? this.redirect(letter) : null;
  }


  redirect = (letter: string) => {

    this.selected = true;
    this.selections[letter] = letter;

    this.sendData();
    const msg    = `Bien, Seleccionaste la letra: ... ${this.soundsLetters[letter]}`;
    const speech = this.speechSynthesis.speak(msg, .95);
    const url    = `lectura/detalle-letra/${letter}`;

    speech.addEventListener('end', () => this.router.navigateByUrl(url));
  }


  repractice = (letter: string) => {
    this.addTimeRepractice(letter);
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


  initUserData = () => {

    const t   = this.genDate.generateData();
    const _id = this._storage.getElement('user')['userId'];

    const times     = new Times(t.fullTime, 'N/D');
    const t_alpha   = new TabAlphabet([times], [], 'N/D' );
    const t_learned = new TabLearnedLetters([], [], []);
    this.userData   = new MenuLettersData(t.fullTime, '', t.fullDate, _id, t_alpha, t_learned);

  }


  addFinalTime = () => {
    this.userData.finalTime = this.genDate.generateData().fullTime;
  }


  addLettersHeard = (letter: string) => {
    const t = this.genDate.generateData().fullTime;
    this.userData.tab_alphabet.lettersHeard.push(new LettersHeard(letter, t));
  }


  addSelections = (letter: string) => {
    this.userData.tab_alphabet.selection = letter;
  }


  activeTabLearned = () => {

    if (this.showAlphabet === true) {
      const x = new Times(this.genDate.generateData().fullTime, 'N/D');
      this.userData.tab_learned.times.push(x);
    }

  }


  deactiveTabLearned = () => {

    if (this.showAlphabet === false) {
      const c = this.userData.tab_learned.times;
      c[c.length - 1].finalTime = this.genDate.generateData().fullTime;
    }

  }


  activeTabAlphabet = () => {

    if (this.showAlphabet === false) {
      const x = new Times(this.genDate.generateData().fullTime, 'N/D');
      this.userData.tab_alphabet.times.push(x);
    }

  }


  deactiveTabAlphabet = () => {

    if (this.showAlphabet === true) {
      const c = this.userData.tab_alphabet.times;
      c[c.length - 1].finalTime = this.genDate.generateData().fullTime;
    }

  }


  addSortingCount = (sort: string) => {

    const t = this.genDate.generateData().fullTime;
    const c = sort === 'alphabet' || sort === 'rating' ? this.userData.tab_learned.sort.push(new Sort(sort, t)) : null;

  }


  itemOpened = (letter: string) => {
    this.speechSynthesis.cancel();
    const index = this.userData.tab_learned.previewLetters.findIndex(e => e.letter === letter);
    const time = this.genDate.generateData().fullTime;
    const t  = new Times(time, 'N/A');

    if (index === -1) {

      const s = [];
      this.combinations[letter].forEach(i => s.push(new Syllable(i.w, [])));
      const el = new PreviewLetter(letter, [t], [], [], s, 'N/D');
      this.userData.tab_learned.previewLetters.push(el);

    } else {

      const path = this.userData.tab_learned.previewLetters;
      const item = path[index].time.push(t);

    }



  }


  itemClosed = (letter: string) => {

    this.speechSynthesis.cancel();
    const t     = this.genDate.generateData().fullTime;
    const path  = this.userData.tab_learned.previewLetters;
    const index = path.findIndex( e => e.letter === letter);
    const el    = path[index].time;
    const val   = index > -1 ? el[el.length - 1].finalTime = t : null;

  }


  AddListeningsCount = (letter: string, code: string, syllable?: string) => {

    const t     = this.genDate.generateData().fullTime;
    const path  = this.userData.tab_learned.previewLetters;
    const index = path.findIndex( e => e.letter === letter);
    const el    = path[index];

    switch (code) {
      case 'l':
        el.lowerCase.push(t);
        break;

        case 'u':
        el.upperCase.push(t);
        break;

      default:
        const iSyllable = el.syllables.findIndex(e => e.syllable === syllable);
        const element   = el.syllables[iSyllable].time.push(t);
        break;
    }

  }


  addTimeRepractice = (letter: string) => {
    const t     = this.genDate.generateData().fullTime;
    const path  = this.userData.tab_learned.previewLetters;
    const index = path.findIndex(e => e.letter === letter);
    const el    = path[index];

    el.timeRePractice       = t;
    this.userData.finalTime = t;
    this.itemClosed(letter);

  }


  addTimePracticeLetter = (letter: string) => {

    const t = this.genDate.generateData().fullTime;
    this.userData.tab_alphabet.selection = letter;
    this.userData.finalTime = t;
    this.showAlphabet       = true;

    this.deactiveTabAlphabet();
  }

  sendData = () => {
    this._sendData.send(this.userData)
      .subscribe(
        val => console.log(val),
        err => console.log(err),
      );
  }

}
