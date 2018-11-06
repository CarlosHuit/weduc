import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { GenerateDatesService } from '../../services/generate-dates.service';
import { SendDataService } from '../../services/send-data.service';
import { DetectMobileService } from '../../services/detect-mobile.service';
import { GetDataService, RandomSimilarLetters } from '../../services/get-data.service';
import { HttpResponse } from '@angular/common/http';
import { PreloadAudioService } from '../../services/preload-audio.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SimilarLettersService } from '../../services/similar-letters/similar-letters.service';

interface Option {
  user_id?:     string;
  date?:        string;
  startTime?:   string;
  letter?:      string;
  amount?:      number;
  correct?:     number;
  incorrect?:   number;
  repetitions?: number;
  historial?:   Record[];
  finalTime?:   string;

}

interface Record {
  letter?: string;
  time?:   string;
  status?: boolean;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {


  @ViewChild('mcGame') mcLetters:    ElementRef;

  opportunities     = 0;
  failedCount       = 0;
  succesCount       = 0;
  lettersValidation = {};
  dataToSend        = [];
  show              = false;
  loading:          boolean;
  success:          boolean;
  showGame:         boolean;
  letterParam:      string;
  elToDestroy:      string;
  urlToRedirect:    string;
  letter:           string;
  letters:          string[];
  letterIDs:        string[][] = [[]];
  arrayIDs:         string[]   = [];
  clearEl:          any        = {};
  userData:         Option     = {};
  mcGameEl:         HTMLDivElement;
  lettersData:      RandomSimilarLetters;



  constructor(
    private router:        Router,
    private speechService: SpeechSynthesisService,
    private _route:        ActivatedRoute,
    private genDates:      GenerateDatesService,
    private sendData:      SendDataService,
    private detectMobile:  DetectMobileService,
    private getData:       GetDataService,
    private _sound:        PreloadAudioService,
    private _storage:      LocalStorageService,
    private _sL:           SimilarLettersService
  ) {

    this.success       = false;
    this.loading       = true;
    this.letterParam   = this._route.snapshot.paramMap.get('letter');
    this.urlToRedirect = `lectura/dibujar-letra/${this.letterParam}`;
  }

  ngAfterViewInit() {

    const t = this._storage.getElement(`${this.letterParam.toLowerCase()}_sl`);

    if (t !== null) {
      this.lettersData = this._sL.getDataFromStorage(this.letterParam);
      this.letter      = this.letterParam;
      this.letterIDs   = this.prepareData(this.lettersData.lowerCase);
      this.letters     = this.joinLetters(this.letterIDs);

      setTimeout(e => this.loading = false, 0);

      window.addEventListener('resize', e => setTimeout(() => this.restartData(), 0));
      window.addEventListener('resize', e => setTimeout(() => this.isMobile(), 10));

      this.initUserData();
      this.instructions();
    } else {

      this.getLettersRandom();

    }

  }


  ngOnInit() {
    setTimeout(e => this.showGame = true, 0);
    this._sound.loadAudio();

  }

  isMobile = () => this.detectMobile.isMobile();

  getLettersRandom = () => {
    this.getData.getRandomSimilarLetters(this.letterParam)
      .subscribe(
        (res: HttpResponse<RandomSimilarLetters>) => {

          if (res.status === 200) {
            this.lettersData = res.body;
            this.letter      = this.letterParam;

            // prepararDatos
            this.letterIDs   = this.prepareData(this.lettersData.lowerCase);
            this.letters     = this.joinLetters(this.letterIDs);

            this.loading     = false;
            this.initUserData();
            this.instructions();
          } else {
            console.log('imposible obtener los datos');
          }
        },
        err => console.log(err)
      );
  }

  ngOnDestroy() {
    this.speechService.cancel();
  }

  prepareData = (letters: string[]) => {

    const array   = JSON.parse(JSON.stringify(letters));
    const columns = Math.floor(this.mcLetters.nativeElement.clientWidth / 80);
    const missing = columns - (array.length % columns);

    for (let i = 0; i < missing; i++) {
      const element = `${array[i][0]}4${i}`;
      array.push(element);
    }

    const result = [];
    const max = array.length / columns;

     for (let i = 0; i < columns; i++) {
      const el = array.splice(0, max);
      result.push(el);
    }
    console.log(result);
    return result;
  }

  joinLetters = (array: string[][]): string[] => {
    const d = [];
    array.forEach(cLetters => cLetters.forEach(letter => d.push(letter)));
    return d;
  }

  showLetters = () => {
    this.show = true;
    setTimeout(x => this.show = false, 900);
  }


  restartData = () => {


    this.lettersValidation = {};
    this.clearEl = {};
    this.restartCounters();

    setTimeout(() => {
      const letter = this.letter === this.letterParam.toLowerCase() ? 'lower' : 'upper';

      if (letter === 'lower') {

        this.letterIDs = this.prepareData(this.lettersData.lowerCase);
        this.letters = this.joinLetters(this.letterIDs);

      } else {

        this.letterIDs = this.prepareData(this.lettersData.upperCase);
        this.letters = this.joinLetters(this.letterIDs);

      }
    }, 50);


  }


  instructions = () => {

    this.countRepetitions();

    const type    = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const letter  = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam];
    const sentece = `Presiona todas las letras ${letter} ${type}`;

    setTimeout(() => {
      if (this.opportunities < 3) {
        this.opportunities ++;
        this.show = true;
      }
    }, 500);

    const speak = this.speechService.speak(sentece, .9);
    speak.addEventListener('end', e => this.show = false );

  }

  restartCounters = (): void => {
    this.succesCount = 0;
    this.failedCount = 0;
  }


  speak = (str: string) => {
    this.speechService.speak(str);
  }

  onSelect = (id: string) => {


    const letter      = id[0];
    const letterSound = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam];
    const type        = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msg         = `${letterSound} ${type}`;

    this.elToDestroy = letter === this.letter ? id : 'false';

    if (this.elToDestroy !== 'false') {

      this.succesCount++;
      this.lettersValidation[id] = id;
      this.clearEl[id] = id;

      this.addSelection(letter, true);
      const speak = this.speechService.speak(msg);


      setTimeout(e => this.removeElement(id), 395);

        setTimeout(e => {
        const index = this.letters.indexOf(id);
        const i = index > -1 ? this.letters.splice(index, 1) : false;
      }, 600);

      speak.addEventListener('end', () => {

        const pendings = this.countPendings();
        if (pendings === 0) {

          this.success = true;
          const isLowerCase = this.letter === this.letterParam.toLowerCase() ? true : false;
          const val = isLowerCase === true ? this.nextLetter() : this.redirect();

        }

      });



    } else {

      this.addSelection(letter, false);
      this._sound.playAudio();
      this.failedCount++;
    }

  }

  removeElement = (id: string) => {
    this.letterIDs.forEach(group => {
      const index = group.indexOf(id);
      if (index > -1) {
        group.splice(index, 1);
      }
    });
  }

  countPendings = () => {
    let count = 0;
    this.letters.forEach(x => {
      if (x[0] === this.letter) { count += 1; }
    });

    return count;
  }


  nextLetter = () => {

    this.insertGroupOfSelection();
    this.restartCounters();

    this.letter    = this.letterParam.toUpperCase();
    this.letterIDs = this.prepareData(this.lettersData.upperCase);
    this.letters   = this.joinLetters(this.letterIDs);

    const speak = this.speechService.speak('"Bien Hecho"', .9);
    speak.addEventListener('end', e => {
      this.success = false;
      this.initUserData();
      this.instructions();
    });

  }

  redirect = () => {

    this.insertGroupOfSelection();
    this.send();

    const speech = this.speechService.speak('Bien Hecho!', .85);
    speech.addEventListener('end', e => this.router.navigateByUrl(this.urlToRedirect));

  }


  initUserData = () => {

    const startTime = this.genDates.generateData();

    this.userData['user_id'] = 'N/A';
    this.userData['date'] = startTime.fullDate;
    this.userData['startTime'] = startTime.fullTime;
    this.userData['amount'] = this.countLetters();
    this.userData['letter'] = this.letter;
    this.userData['correct'] = 0;
    this.userData['incorrect'] = 0;
    this.userData['repetitions'] = 0;
    this.userData['historial'] = [];
    this.userData['finalTime'] = 'N/A';

  }

  createData = (letter: string, status: boolean): Record => {

    const time      = this.genDates.generateData();
    const x: Record = { letter: letter, time: time.fullTime, status: status };

    return x;
  }

  addSelection = (letter: string, status: boolean) => {

    const x = this.createData(letter, status);
    this.userData['historial'].push(x);

  }


  insertGroupOfSelection = () => {
    this.addFinalTime();
    const m = JSON.parse(JSON.stringify(this.userData));
    this.dataToSend.push(m);
  }

  countLetters = (): number => {

    let count = 0;

    this.arrayIDs.forEach(el => {
      const t = el[0] === this.letter ? count++ : false;
    });

    return count;

  }


  addFinalTime = (): void => {
    this.userData['correct'] = this.succesCount;
    this.userData['incorrect'] = this.failedCount;

    const data = this.genDates.generateData();
    this.userData['finalTime'] = data.fullTime;

  }

  countRepetitions = () => {
    this.userData['repetitions']++;
  }

  send = () => {
    this.sendData.sendGameData(this.dataToSend)
      .subscribe(
        v => { const x = v; },
        e => { const err = e; }
      );
  }


}
