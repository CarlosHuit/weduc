import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router       } from '@angular/router';
import { GetWordsService              } from '../../services/get-words/get-words.service';
import { HttpResponse                 } from '@angular/common/http';
import { SpeechSynthesisService       } from '../../services/speech-synthesis.service';
import { GenerateDatesService         } from '../../services/generate-dates.service';
import { SendDataService              } from '../../services/send-data.service';
import { DetectMobileService          } from '../../services/detect-mobile.service';
import { LocalStorageService          } from '../../services/local-storage.service';
import { SelectWords, Historial       } from '../../interfaces/select-words';
import { RandomWords                  } from '../../interfaces/random-words';



@Component({
  selector: 'app-select-words',
  templateUrl: './select-words.component.html',
  styleUrls: ['./select-words.component.css']
})
export class SelectWordsComponent implements OnInit, OnDestroy {


  words:          RandomWords;
  audioIncorrect: HTMLAudioElement;
  userData:       SelectWords = {};
  Data:           SelectWords[]   = [];
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


  constructor(
    private _route:    ActivatedRoute,
    private getData:   GetWordsService,
    private router:    Router,
    private speech:    SpeechSynthesisService,
    private genDates:  GenerateDatesService,
    private _sendData: SendDataService,
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

    const x = this._storage.getElement('words');
    const y = this._storage.getElement(`${this.letterParam}_w`);

    if ( Storage && x !== null && y !== null ) {
      this.getLocalStorageData();
    } else {
      this.getServerData();
    }

  }

  getLocalStorageData = () => {

    const x = this.getData.getAndMessUpWordsFromStorage( this.letterParam );
    this.configData(x);

  }

  getServerData = () => {

    this.getData.getRandomWords(this.letterParam)
      .subscribe(
        (res: HttpResponse<RandomWords>) => {

          const v = res.status === 200 ? this.configData(res.body) : console.log('Imposible obtener los datos');

        },
        (err) => console.log(err)
      );
  }

  configData = (data: RandomWords) => {

    this.words        = data;
    this.letterToVal  = this.letterParam.toLowerCase();
    this.messyWords   = this.words.lowerCase.words;
    this.correctWords = this.words.lowerCase.corrects;

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

    const t = this.genDates.generateData();

    this.userData['user_id']    = 'N/A';
    this.userData['date']       = t.fullDate;
    this.userData['startTime']  = t.fullTime;
    this.userData['finishTime'] = 'N/A';
    this.userData['replays']    = [];
    this.userData['letter']     = this.letterToVal;
    this.userData['amount']     = this.correctWords.length;
    this.userData['corrects']   = 0;
    this.userData['incorrects'] = 0;
    this.userData['pattern']    = this.messyWords;
    this.userData['historial']  = [];


  }

  addHistorial = (word: string, state: boolean) => {

    const addCount = state === true ? this.userData.corrects ++ : this.userData.incorrects ++;
    const t = this.genDates.generateData();

    const x: Historial = {
      time: t.fullTime,
      word: word,
      state: state
    };

    this.userData.historial.push(JSON.parse(JSON.stringify(x)));
  }

  addFinalTime = () => {

    const t = this.genDates.generateData();
    this.userData.finishTime = t.fullTime;
    this.addAndResetUserData();

  }

  addAndResetUserData = () => {

    this.Data.push(JSON.parse(JSON.stringify(this.userData)));
    this.userData = {};

  }

  sendSelecWordsData = () => {

    this._sendData.sendSelectWordsData(this.Data)
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
  }

}
