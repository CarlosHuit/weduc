import { Component, OnInit, OnDestroy   } from '@angular/core';
import { ActivatedRoute, Router         } from '@angular/router';
import { SpeechRecognitionService       } from '../../services/speech-recognition.service';
import { SpeechSynthesisService         } from '../../services/speech-synthesis.service';
import { SdPronounceLetterService       } from '../../services/send-user-data/sd-pronounce-letter.service';
import { GenerateDatesService           } from '../../services/generate-dates.service';
import { LocalStorageService            } from '../../services/local-storage.service';
import { PronounceLetterData, Historial } from '../../classes/pronounce-letter-data';
import { UserProgressService            } from '../../services/user-progress/user-progress.service';
import { LearnedLetters } from 'src/app/classes/learned-letters';


@Component({
  selector: 'app-pronounce-letter',
  templateUrl: './pronounce-letter.component.html',
  styleUrls: ['./pronounce-letter.component.css']
})
export class PronounceLetterComponent implements OnInit, OnDestroy {

  letters:        string[] = [];
  letter:         string;
  letterParam:    string;
  activeRecord:   boolean;
  showButtonHelp: boolean;
  startTime:      string;
  finalTime:      string;
  urlToRedirect:  string;


  loading:  Boolean;
  success:  Boolean;
  userData: PronounceLetterData;
  Data:     PronounceLetterData[] = [];



  constructor(
    private _recognition: SpeechRecognitionService,
    private _sendData:    SdPronounceLetterService,
    private _synthesis:   SpeechSynthesisService,
    private _dates:       GenerateDatesService,
    private _progress:    UserProgressService,
    private _storage:     LocalStorageService,
    private _route:       ActivatedRoute,
    private router:       Router,
  ) {
    this.letterParam = this._route.snapshot.paramMap.get('letter');
    this.loading = true;
    this.success = false;
    this.urlToRedirect = '/lectura/abecedario';
  }


  ngOnInit() {
    this.instructions();
    this.setValues();
  }


  ngOnDestroy() {
    this._synthesis.cancel();
    // this._recognition.DestroySpeechObject();
  }


  setValues = (): void => {

    this.letters.push(this.letterParam.toUpperCase());
    this.letters.push(this.letterParam.toLowerCase());

    this.letter  = this.letters[0];

    this.initUserData();
    this.loading = false;

  }


  speak = (): void => {

    console.log('-- start recording --');
    this._synthesis.cancel();

    this.activeRecord = true;
    this.startTime    = this._dates.generateData().fullTime;

    this._recognition.record()
      .subscribe(
        res => this.handleResponse(res),
        err => this.handleError(err),
        ()  => this.onStopRecord()
      );
  }


  handleResponse = (res: string): void => {

    this.activeRecord = false;
    this.finalTime    = this._dates.generateData().fullTime;

    const type      = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msgVal    = `${this.letter} ${type}`;

    if (res === 'no-match') {
      this.addElToHistorial(res, this.startTime, this.finalTime, false);
      this.listenErrorMsg();
    }

    if (res !== 'no-match' && res.toLowerCase() !== msgVal.toLowerCase() ) {
      this.addElToHistorial(res, this.startTime, this.finalTime, false);
      this.listenIncorrectMsg();
    }

    if (res.toLowerCase() === msgVal.toLowerCase()) {

      this.addElToHistorial(res, this.startTime, this.finalTime, true);

      this.showButtonHelp = false;
      this.success        = true;
      this.next();

    }

  }


  next = (): void => {

    this.success    = true;
    this.addDataToUserData();

    const index     = this.letters.indexOf(this.letter);
    const nextIndex = index + 1;

    if (nextIndex === this.letters.length) {
      this.redirect();
    }

    if ( nextIndex < this.letters.length ) {

      this.letter = this.letters[nextIndex];
      const speak = this._synthesis.speak('"Bien Hecho!"', .85);
      this.showButtonHelp = false;

      speak.addEventListener('end', e => {
        this.success = false;
        this.initUserData();
        this.instructions();
      });

    }
  }


  redirect = (): void => {

    this.success = true;
    this.sendData();

    const speak  = this._synthesis.speak('"Bien Hecho!"', .85);
    speak.addEventListener('end', e => this.router.navigateByUrl(this.urlToRedirect));

  }


  onStopRecord = (): void => {

    this.activeRecord = false;
    console.log('-- stop recording --');

  }


  handleError = (err): void => {

    this.activeRecord = false;
    this.finalTime    = this._dates.generateData().fullTime;

    this.addElToHistorial(err.error, this.startTime, this.finalTime, false);
    const noSpeech = err.error === 'no-speech' ? this.listenErrorMsg() : false;

  }


  listenErrorMsg = (): void => {
    this._synthesis.speak('Si dijiste algo no se escuchó!');
  }


  listenIncorrectMsg = (): void => {

    this.showButtonHelp = true;
    const speak = this._synthesis.speak('intenta otra vez... Presiona el botón azul para obtener ayuda ', .95);

  }


  help = () => {

    this.addCountHelp();
    const letter = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam];
    const type   = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msg    = `Esta es la letra: ${letter} ${type}`;

    const speak = this._synthesis.speak(msg, .9);

  }


  instructions = (): void => {

    const msg   = 'Presiona el micrófono y dí Cuál es esta letra';
    const speak = this._synthesis.speak(msg, .96);

  }


  initUserData = () => {

    const t       = this._dates.generateData();
    const id      = this._storage.getElement('user')['userId'];
    this.userData = new PronounceLetterData(id, t.fullTime, 'N/D', t.fullDate, this.letter, [], []);

  }


  addDataToUserData = () => {

    this.userData['finalTime'] = this._dates.generateData().fullTime;
    this.Data.push(JSON.parse(JSON.stringify(this.userData)));

  }


  addCountHelp = (): void => {

    this.userData['countHelp'].push(this._dates.generateData().fullTime);

  }


  addElToHistorial = ( sentence: string, startRecord: string, finalRecord: string, state: boolean ): void => {

    const x = new Historial(startRecord, finalRecord, sentence, state);
    this.userData.historial.push(x);

  }


  sendData = (): void => {
    this._sendData.sendPronounceLettersData(this.Data)
      .subscribe(
        res => { const e = res; },
        err => { const x = err; }
      );

    this._progress.sendUserProgress( new LearnedLetters(this.letterParam, 3) )
        .subscribe(
          (val) => console.log(val),
          (err) => console.log(err),
        );
  }


}

