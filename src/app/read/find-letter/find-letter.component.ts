import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute       } from '@angular/router';
import { SpeechSynthesisService       } from '../../services/speech-synthesis.service';
import { GenerateDatesService         } from '../../services/generate-dates.service';
import { SdFindLettersService         } from '../../services/send-user-data/sd-find-letters.service';
import { DetectMobileService          } from '../../services/detect-mobile.service';
import { PreloadAudioService          } from '../../services/preload-audio.service';
import { LocalStorageService          } from '../../services/local-storage.service';
import { ShuffleService               } from '../../services/shuffle/shuffle.service';
import { Words                        } from '../../classes/words';
import { FindLetterData, Options, Selection } from '../../classes/find-letter-data';
import { GetWordsService              } from '../../services/get-data/get-words.service';


@Component({
  selector: 'app-find-letter',
  templateUrl: './find-letter.component.html',
  styleUrls: ['./find-letter.component.css']
})


export class FindLetterComponent implements OnInit, OnDestroy {

  userData: FindLetterData;

  words:        string[];
  letters:      string[];
  arrayIDs:     string[];
  letterParam:  string;
  urlImage:     string;
  word:         string;
  url:          string;
  loading:      boolean;
  success:      boolean;
  showC:        boolean;
  totalWords:   number;
  currentIndex  = 0;
  selection     = {};

  constructor(
    private router:    Router,
    private _route:    ActivatedRoute,
    private _getData:   GetWordsService,
    private speech:    SpeechSynthesisService,
    private genDates:  GenerateDatesService,
    private _sendData: SdFindLettersService,
    private _mobile:   DetectMobileService,
    private _sound:    PreloadAudioService,
    private _storage:  LocalStorageService,
    private _shuffle:  ShuffleService,
  ) {

    this.loading      = true;
    this.letterParam  = this._route.snapshot.paramMap.get('letter');
    this.url          = `/lectura/seleccionar-palabras/${this.letterParam}`;
    this.words        = this._storage.getElement(`${this.letterParam}_w`);
  }

  ngOnInit() {

    this.getData();
    this._sound.loadAudio();
    window.addEventListener('resize', this.isMobile);

  }

  ngOnDestroy() {

    this.speech.cancel();
    window.removeEventListener('resize', this.isMobile);

  }

  getData = (): void => {

    this._getData.getWordsOfLetter(this.letterParam)
      .subscribe(
        (data: Words) => this.configInitialData(data.words),
        (err) => console.log(err)

      );
  }

  configInitialData = (words: string[]) => {

    this.words      = this._shuffle.mess(words);
    this.totalWords = this.words.length;

    this.changeDates(this.words[0]);
    this.preloadImage('s');

    this.loading = false;
    this.initUserData();
    this.addWordData(this.word);

    setTimeout(() => this.showC = true, 10);
    this.instructions();

  }

  changeWord = (index: number) => {

    this.removeClass();
    this.changeDates(this.words[index]);


    const speech = this.speech.speak('Bien Hecho!', 0.85);

    speech.addEventListener('end', e => (this.success = false, this.addWordData(this.word), this.instructions()));

  }

  removeClass = () => this.selection = {};

  changeDates = (word: string) => {

    this.word     = word;
    this.letters  = this.word.split('');
    this.urlImage = this.generateUrlImage(this.word);
    this.arrayIDs = this.generateArrayIDs(this.letters);

  }

  generateArrayIDs = (l: string[]): string[] => {

    const r = [];

    for (let i = 0; i < l.length; i++) {

      r.push(`${this.letters[i]}${i}`);

    }

    return r;

  }

  advance = () => {

    const result = 100 - (((this.totalWords -  this.currentIndex) * 100) / this.totalWords);
    return result;

  }


  isMobile = (): boolean => {

    return this._mobile.isMobile();

  }

  pendingLetters = () => {

    let count = 0;

    this.arrayIDs.forEach(e => {
    const letter     = e[0];
    const validation = letter === this.letterParam.toLowerCase() || letter === this.letterParam.toUpperCase() ? true : false;

    if (validation === true) {
      const x = this.selection[e] !== e ? count++ : false    ;
    }

    });

    return count;

  }

  onSelect = (id: string) => {

    const txt        = id[0];
    const validation = txt === this.letterParam.toLowerCase() || txt === this.letterParam.toUpperCase();

    if (validation) {

      this.addCount(this.word, 'correct', txt,  true);

      const saveSel = this.selection[id] !== id ? this.selection[id] = id : null;
      const p = this.pendingLetters();
      const s = this.speech.speak('Correcto');

      const addProgress =  p === 0 ? this.currentIndex = this.words.indexOf(this.word) + 1 : null;

      s.addEventListener('end', e => p === 0 ? this.next() : false);


    } else {

      this.addCount(this.word, 'incorrect', txt,  false);
      this._sound.playAudio();

    }
  }

  next = () => {

    this.addFinalTimeWord(this.word);
    this.success    = true;
    const nextIndex = this.words.indexOf(this.word) + 1;
    const x         = nextIndex < this.words.length ? this.changeWord(nextIndex) : this.redirect();

  }



  redirect = () => {

    this.addFinalTimeComponent();
    this.send();

    this.success = true;


    const msg = 'Lo has hecho muy bien.. continuemos.';
    const speech = this.speech.speak(msg);

    speech.addEventListener('end', e => this.router.navigateByUrl(this.url));

  }

  instructions = () => {

    this.addCount(this.word, 'instructions');
    const s   = this._storage.getElement('letter_sounds')[this.letterParam];
    const msg = `Selecciona todas las letras ... ${s} ... de la palabra ... ${this.word}`;

    setTimeout(() =>  this.speech.speak(msg), 500);

  }



  generateUrlImage = (name: string) => {
    return `/assets/img-min/${name}-min.png`;
  }

  preloadImage = (name: string) => {
    this.words.forEach(word => {
      new Image().src = `/assets/img-min/${word}-min.png`;
    });
  }

  speak = () => {
    this.addCount(this.word, 'pressImage');
    this.speech.speak(this.word);
  }

  genStyles = (el: HTMLDivElement, container: HTMLDivElement) => {

    const lenght  = this.word.length;
    const cWidth  = container.clientWidth;
    const cHeight = container.clientHeight;
    const w       = el.clientWidth;

    if (cHeight > cWidth) {
      if (lenght <= 4) {

        return { 'min-width': `55px`, 'font-size': `${w * 0.16}px` };

      } else if ( lenght > 4 && lenght <= 6 ) {

        return { 'min-width': `45px`, 'font-size': `${w * 0.16}px` };

      } else if (lenght === 7 ) {

        return { 'min-width': `35px`, 'font-size': `${w * 0.16}px` };

      } else if (lenght > 7 ) {

        return { 'min-width': `30px`, 'font-size': `${w * 0.135}px` };

      }

    }

    if (cHeight < cWidth) {

      if (lenght <= 6) {

        return { 'min-width': `45px`, 'font-size': `${w * 0.135}px` };

      } else {

        return { 'min-width': `38px`, 'font-size': `${w * 0.10}px` };

      }

    }

  }

  genSizeDesk = (el: HTMLDivElement) => {
    return {
      'width': `${el.clientHeight}px`,
      'heght': `${el.clientHeight}px`
    };
  }

  initUserData = (): void => {

    const t  = this.genDates.generateData();
    const id = this._storage.getElement('user')['userId'];
    this.userData = new FindLetterData(id, t.fullDate, t.fullTime, 'N/A', this.letterParam, []);

  }

  addWordData = (word): void => {

    const t = this.genDates.generateData().fullTime;
    const x = new Options(word, t, 'N/A', 0, 0, [], [], []);
    this.userData.words.push(x);

  }

  addCount = (word: string, code: string, letter?: string, state?: boolean): void => {

    const t = this.genDates.generateData().fullTime;
    const i = this.userData.words.findIndex(m => m.word === word );
    const e = this.userData.words[i];

    const pImg  = code === 'pressImage'   ? e.pressImage.push(t)   : null;
    const pHelp = code === 'instructions' ? e.instructions.push(t) : null;

    if (code  === 'correct' || code === 'incorrect') {
      e[code]++;
      e.historial.push(new Selection(letter, t, state));
    }

  }

  addFinalTimeWord = (word: string): void => {

    const t = this.genDates.generateData().fullTime;
    const i = this.userData.words.findIndex(m => m.word === word);
    this.userData.words[i].finalTime = t;

  }

  addFinalTimeComponent = (): void => {

    this.userData.finalTime = this.genDates.generateData().fullTime;
  }

  send = () => {

    this._sendData.sendDrawLetters(this.userData)
      .subscribe(
        val => { const v = val; },
        err => { const e = err; }
      );
  }

}


