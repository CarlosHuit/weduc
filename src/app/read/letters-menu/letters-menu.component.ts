import { Component, OnInit, ViewChild, OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { Router                 } from '@angular/router';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { GenerateDatesService   } from '../../services/generate-dates.service';
import { GetDataService  } from '../../services/get-data.service';
import { SendDataService        } from '../../services/send-data.service';
import { DetectMobileService    } from '../../services/detect-mobile.service';
import { MenuData, Selection    } from '../../interfaces/menu-data';
import { Words, WordsAndLetters } from '../../interfaces/words-and-letters';

@Component({
  selector:    'app-letters-menu',
  templateUrl: './letters-menu.component.html',
  styleUrls:   ['./letters-menu.component.css']
})

export class LettersMenuComponent implements OnInit, OnDestroy {

  @ViewChild('containerDetail') containerDetail: ElementRef;

  styles: {};
  @ViewChild('contGrid') contGrid: ElementRef;
  letters:        string[] = [];
  words:          string[] = [];
  storage:        boolean;
  currentLetter:  string;
  loading   =     true;
  showModal =     false;
  data:           WordsAndLetters;
  userData:       MenuData = {};
  count = 0;
  soundsLetters = {};
  selections = {};

  wordsUrl = {};

  learned = {};
  selected: boolean;

  constructor(
    private getData:         GetDataService,
    private speechSynthesis: SpeechSynthesisService,
    private router:           Router,
    private sendData:        SendDataService,
    private genDate:         GenerateDatesService,
    private detMobile:       DetectMobileService
  ) {
    const l = JSON.parse(localStorage.getItem('learned_letters'));
    this.learned = l !== null ? l : {};
  }

  ngOnInit() {

    this.getData.getWordsAndLetters()
      .subscribe(
        (data: WordsAndLetters) => {
          this.data = data;
          this.setInitialData(this.data);
          this.instructions('y');
          this.addInitialTime();

           if ( this.isMobile() === true ) {
            //  (window as any).onclick = ev => this.closeModalContainer(ev);
           }

           (window as any).onresize = () => this.genCols(this.contGrid.nativeElement);

        },
        err => console.log(err)
      );


  }


  ngOnDestroy() {
    this.speechSynthesis.cancel();
  }


  closeModalContainer = (ev) => {
    const t = ev.target === this.containerDetail.nativeElement ? this.closeModal() : false;
  }

  isMobile = (): boolean => {
    return this.detMobile.isMobile();
  }

  setInitialData = (data: WordsAndLetters) => {

    const words   = data.words;
    const letters = data.letters;

    words.forEach(e => this.wordsUrl[e.letter] = e.words[this.randomInt(0, e.words.length)]);

    this.letters       = letters.alphabet.split('');
    this.soundsLetters = letters.sound_letters;

    if (Storage) {

      localStorage.setItem('alphabet',      JSON.stringify(letters.alphabet));
      localStorage.setItem('consonants',    JSON.stringify(letters.consonants));
      localStorage.setItem('vocals',        JSON.stringify(letters.vocals));
      localStorage.setItem('combinations',  JSON.stringify(letters.combinations));
      localStorage.setItem('letter_sounds', JSON.stringify(letters.sound_letters));

      // a list of words is saved for each letter
      words.forEach(el => localStorage.setItem(el.letter, JSON.stringify(el.words)));
    }

    this.loading = false;

  }

  getImage = (letter) => `/assets/img100X100/${this.wordsUrl[letter]}-min.png`;

  genUrl = (word: string) => `/assets/img100X100/${word}-min.png`;

  getCombinations = (letter: string) => {

    const combinations = JSON.parse(localStorage.getItem('combinations'));
    return combinations[letter];

  }


  findData = (letter: string) => {
    const item = localStorage.getItem(letter);

    if (item !== null) {

      this.currentLetter = letter;
      this.words = JSON.parse(localStorage.getItem(letter));

    } else {

      this.data.words.forEach( el => {
        if (el.letter === letter) {
          this.currentLetter = el.letter;
          this.words         = el.words;
        }
      });

    }
  }


  instructions = (type?: string) => {
    const msg1 = `Este es el abecedario. Selecciona una letra para aprender mas.`;
    const msg2 = '"El abecedario"';
    const msg  = type ? msg1 : msg2;

    const speech = this.speechSynthesis.speak(msg);

  }

  randomInt = (min = 0, max) => Math.floor(Math.random() * (max - min)) + min;

  listenLetter = (letter: string, type: string) => {
    const typeLetter = type === 'l' ? 'minúscula' : 'mayúscula';
    const addCount   = type === 'l' ? this.countLetterLower() : this.countLetterUpper();

    const soundLetter = this.soundsLetters[letter];

    const msg        = `${soundLetter} '${typeLetter}'`;

    this.speechSynthesis.speak(msg);
  }


  listenWord = (word: string, type?: string) => {

    const firstLetter = word[0];
    const validation  = firstLetter === this.currentLetter.toLowerCase() || firstLetter === this.currentLetter.toUpperCase();

    this.addCountToWord(word);

    if (validation) {

      const msg  = `${word}... comienza con la letra: ... ${this.soundsLetters[firstLetter.toLowerCase()]}...`;
      const speech = this.speechSynthesis.speak(msg, .9);

    } else {
      const soundWord = this.soundsLetters[this.currentLetter];
      const msg = `${word} contiene la letra "${soundWord}"`;
      this.speechSynthesis.speak(msg, .9);

    }

  }

  listen = (item: {w: string; p: string}, velocity?: number) => {
    const p = item.p;
    const w = item.w;
    this.addCountToSyllable(w);
    this.speechSynthesis.speak(p, velocity);

  }

  listenSoundLetter = (letter: string) => {
    const t = JSON.parse(localStorage.getItem('letter_sounds'))[letter.toLowerCase()];
    this.speechSynthesis.speak(t, .8);

  }


  /* Eventos del modal que contiene los detalles de la letra seleccionada */
  openModal = (letter: string) => !this.selected ? this.redirect(letter) : null;

  redirect = (letter: string) => {
    this.selected = true;
    this.selections[letter] = letter;
    const msg    = `Bien, Seleccionaste la letra: ... ${this.soundsLetters[letter]}`;
    const speech = this.speechSynthesis.speak(msg, .95);
    speech.addEventListener('end', () => {

      const url = `lectura/detalle-letra/${letter}`;
      this.router.navigateByUrl(url);

    });
  }


  closeModal = () => {

    this.showModal = false;
    this.speechSynthesis.cancel();
    this.addCancelTime();
    // console.log(this.userData);

  }





  /* ===== --- RECOLECCION DE DATOS DEL CLIENTE --- ===== */


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
      syllables:      this.fillaSyllables(letter),
      cancelTime:    'N/A',
    };

    const index = this.userData.selection.length;
    this.userData.selection[index] = x;

    this.fillaSyllables(letter);
  }


  fillaSyllables = (letter: string) => {
    const s = {};
    const syllables = this.getCombinations(letter);
    syllables.forEach(el => s[el.w] = 0 );

    return JSON.parse(JSON.stringify(s));
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

  genCols = (el: HTMLDivElement) => {

    const t = el.clientWidth % 320;
    const margin = 5 * 4;
    const minWidth = 300;

    if (t === 0) {

      return { 'grid-template-columns': `repeat(auto-fill, ${minWidth}px)`};

    } else {
      const ts     = Math.floor(el.clientWidth / 300);
      const ttt    = ts * margin;
      const twidth = (el.clientWidth - ttt) / ts;

      return ({ 'grid-template-columns': `repeat(auto-fill, ${twidth}px)` });

    }
  }

}
