import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router       } from '@angular/router';
import { HttpResponse                 } from '@angular/common/http';
import { SpeechSynthesisService       } from '../../services/speech-synthesis.service';
import { GenerateDatesService         } from '../../services/generate-dates.service';
import { DetectMobileService          } from '../../services/detect-mobile.service';
import { LocalStorageService          } from '../../services/local-storage.service';
import { RandomWords                  } from '../../classes/random-words';
import { SelectWordsData, Historial   } from '../../classes/select-words-data';
import { SdSelectWordsService         } from '../../services/send-user-data/sd-select-words.service';
import { GetWordsService              } from '../../services/get-data/get-words.service';



@Component({
  selector: 'app-select-words',
  templateUrl: './select-words.component.html',
  styleUrls: ['./select-words.component.css']
})
export class SelectWordsComponent implements OnInit, OnDestroy {


  words:          RandomWords;
  audioIncorrect: HTMLAudioElement;

  userData:       SelectWordsData;
  Data:           SelectWordsData[] = [];
  messyWords:     string[];
  correctWords:   string[];
  letterParam:    string;
  letterToVal:    string;
  typeLetter:     string;
  state       =   'lowerCase';
  loading     =   true;
  success     =   false;
  incorrects  =   {};
  corrects    =   {};
  selections  =   {};
  urlToRedirect:  string;
  totalCorrects: number;


  constructor(
    private _route:    ActivatedRoute,
    private getData:   GetWordsService,
    private router:    Router,
    private speech:    SpeechSynthesisService,
    private genDates:  GenerateDatesService,
    private _sendData: SdSelectWordsService,
    private _mobile:   DetectMobileService,
    private _storage:  LocalStorageService
  ) {
    this.letterParam   = this._route.snapshot.paramMap.get('letter');
    this.urlToRedirect = `lectura/pronunciar-letra/${this.letterParam}`;
  }

  ngOnInit() {

    this.setData();
    this.loadAudio();

    window.addEventListener('resize', this.isMobile);

  }

  ngOnDestroy() {

    window.removeEventListener('resize', this.isMobile);

  }

  setData = () => {

    this.getData.getRandomWords( this.letterParam )
      .subscribe(
        (res: RandomWords) => this.configData(res),
        (err) => console.log(err)
      );

  }

  configData = (data: RandomWords) => {

    this.words        = data;
    this.letterToVal  = this.letterParam.toLowerCase();
    this.messyWords   = this.words.lowerCase.words;
    this.correctWords = this.words.lowerCase.corrects;
    this.totalCorrects = this.correctWords.length;

    this.initUserData();
    this.loading = false;
    this.instructions();

  }

  repeatInstructions = () => {

    this.userData['replays'].push(this.genDates.generateData().fullTime);
    this.instructions();

  }

  instructions = () => {

    const letter     = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam];
    const typeLetter = this.state === 'lowerCase' ? 'minúscula' : 'mayúscula';
    const msg        = `Selecciona todas las palabras que al menos tengan: ... una letra ${letter} ${typeLetter}`;

    const speak = this.speech.speak(msg);

  }

  isMobile = () => this._mobile.isMobile();

  validation = (word: string) => {

    this.selections[word] = word;

    let corrects = 0;
    word.split('').forEach(letter => letter === this.letterToVal ? corrects ++ : false);

    if (corrects > 0) {

      this.addHistorial(word, true);

      this.speech.speak(word);
      this.corrects[word] = word;
      const index         = this.correctWords.indexOf(word);
      const deleteWord    = index > -1 ? this.correctWords.splice(index, 1) : false;

      if (this.correctWords.length === 0) {

        setTimeout(e => (this.success = true, this.state === 'lowerCase' ? this.next() : this.redirect()), 1200);

      }

    } else {

      this.addHistorial(word, false);
      this.incorrects[word] = word;
      this.playAudio();

    }


  }

  next = () => {

    this.addFinalTime();

    this.corrects = [];
    this.selections = {};
    this.state = 'upperCase';
    this.letterToVal  = this.letterParam.toUpperCase();
    this.messyWords   = this.words.upperCase.words;
    this.correctWords = this.words.upperCase.corrects;
    this.totalCorrects = this.correctWords.length;

    const speak = this.speech.speak('Bien Hecho');
    speak.addEventListener('end', () => {
      this.success = false;
      this.initUserData();
      this.instructions();
    });

  }

  redirect = () => {

    this.addFinalTime();
    this.sendSelecWordsData();

    const msg   = 'Lo has hecho muy bien!';
    const speak = this.speech.speak(msg);
    speak.addEventListener('end', () => this.router.navigateByUrl(this.urlToRedirect));

  }

  loadAudio = () => {

    this.audioIncorrect                  = new Audio('/assets/audio/sounds/incorrect.mp3');
    this.audioIncorrect.oncanplaythrough = () => console.log();
    this.audioIncorrect.volume           = .4;

  }

  playAudio = () => {

    this.speech.cancel();
    this.audioIncorrect.pause();
    this.audioIncorrect.currentTime = 0;
    this.audioIncorrect.play();

  }

  messyUpWords = (words) => {

    let messy = [];

    while (true) {

      if (!words.length) { break; }

      const extraction = words.shift();
      const random     = Math.floor(Math.random() * (messy.length + 1));
      const start      = messy.slice(0, random);
      const medium     = extraction;
      const end        = messy.slice(random, messy.length);

      messy = (start).concat(medium).concat(end);

    }

    return messy;

  }

  initUserData = () => {

    const t  = this.genDates.generateData();
    const id = this._storage.getElement('user')['userId'];

    // tslint:disable-next-line:max-line-length
    this.userData = new SelectWordsData(id, t.fullTime, 'N/A', [], t.fullDate, this.letterToVal, this.correctWords.length, 0, 0, this.messyWords, []);

  }

  addHistorial = (word: string, state: boolean) => {

    const t = this.genDates.generateData().fullTime;

    const addCount = state === true ? this.userData.corrects ++ : this.userData.incorrects ++;
    this.userData.historial.push(new Historial(t, word, state));

  }

  addFinalTime = () => {

    const t = this.genDates.generateData();
    this.userData.finishTime = t.fullTime;
    this.addAndResetUserData();

  }

  addAndResetUserData = () => {

    this.Data.push(JSON.parse(JSON.stringify(this.userData)));

  }

  sendSelecWordsData = () => {

    this._sendData.sendSelectWordsData(this.Data)
      .subscribe(
        val => { const t = val; },
        err => { const x = err; }
      );

    }

}
