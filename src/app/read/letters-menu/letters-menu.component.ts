import { Component, OnInit, ViewChild, OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { GenerateDatesService } from '../../services/generate-dates.service';
import { GetDataService } from '../../services/get-data.service';
import { SendDataService } from '../../services/send-data.service';
import { DetectMobileService } from '../../services/detect-mobile.service';
import { MenuData, Selection } from '../../interfaces/menu-data';
import { WordsAndLetters } from '../../interfaces/words-and-letters';

@Component({
  selector: 'app-letters-menu',
  templateUrl: './letters-menu.component.html',
  styleUrls: ['./letters-menu.component.css']
})

export class LettersMenuComponent implements OnInit, OnDestroy {

  @ViewChild('containerDetail') containerDetail: ElementRef;

  styles: {};
  @ViewChild('contGrid') contGrid: ElementRef;
  letters: string[] = [];
  words: string[] = [];
  storage: boolean;
  currentLetter: string;
  loading = true;
  showModal = false;
  data: WordsAndLetters;
  userData: MenuData = {};
  count = 0;
  soundsLetters = {};
  selections = {};

  wordsUrl = {};

  learned = {};
  selected: boolean;

  constructor(
    private getData: GetDataService,
    private speechSynthesis: SpeechSynthesisService,
    private router: Router,
    private sendData: SendDataService,
    private genDate: GenerateDatesService,
    private detMobile: DetectMobileService
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
          // this.addInitialTime();

          (window as any).onresize = () => this.genCols(this.contGrid.nativeElement);

        },
        err => console.log(err)
      );

  }


  ngOnDestroy() {
    this.speechSynthesis.cancel();
  }

  isMobile = (): boolean => {
    return this.detMobile.isMobile();
  }

  setInitialData = (data: WordsAndLetters) => {

    const words = data.words;
    const letters = data.letters;

    words.forEach(e => this.wordsUrl[e.letter] = e.words[this.randomInt(0, e.words.length)]);

    this.letters = letters.alphabet.split('');
    this.soundsLetters = letters.sound_letters;

    if (Storage) {

      localStorage.setItem('alphabet', JSON.stringify(letters.alphabet));
      localStorage.setItem('consonants', JSON.stringify(letters.consonants));
      localStorage.setItem('vocals', JSON.stringify(letters.vocals));
      localStorage.setItem('combinations', JSON.stringify(letters.combinations));
      localStorage.setItem('letter_sounds', JSON.stringify(letters.sound_letters));

      // a list of words is saved for each letter
      words.forEach(el => localStorage.setItem(el.letter, JSON.stringify(el.words)));
    }

    this.loading = false;

  }

  getImage = (letter) => `/assets/img100X100/${this.wordsUrl[letter]}-min.png`;

  genUrl = (word: string) => `/assets/img100X100/${word}-min.png`;


  findData = (letter: string) => {
    const item = localStorage.getItem(letter);

    if (item !== null) {

      this.currentLetter = letter;
      this.words = JSON.parse(localStorage.getItem(letter));

    } else {

      this.data.words.forEach(el => {
        if (el.letter === letter) {
          this.currentLetter = el.letter;
          this.words = el.words;
        }
      });

    }
  }

  instructions = (type?: string) => {

    const msg1 = `Este es el abecedario. Selecciona una letra para continuar.`;
    const msg2 = 'El abecedario';
    const msg = type ? msg1 : msg2;

    const speech = this.speechSynthesis.speak(msg);

  }

  randomInt = (min = 0, max) => Math.floor(Math.random() * (max - min)) + min;

  listenSoundLetter = (letter: string) => {

    const t = JSON.parse(localStorage.getItem('letter_sounds'))[letter.toLowerCase()];
    this.speechSynthesis.speak(t, .8);

  }

  openModal = (letter: string) => !this.selected ? this.redirect(letter) : null;

  redirect = (letter: string) => {
    this.selected = true;
    this.selections[letter] = letter;
    const msg = `Bien, Seleccionaste la letra: ... ${this.soundsLetters[letter]}`;
    const speech = this.speechSynthesis.speak(msg, .95);
    speech.addEventListener('end', () => {

      const url = `lectura/detalle-letra/${letter}`;
      this.router.navigateByUrl(url);

    });
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
}
