import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { GenerateDatesService   } from '../../services/generate-dates.service';
import { DetectMobileService    } from '../../services/detect-mobile.service';
import { PreloadAudioService    } from '../../services/preload-audio.service';
import { LocalStorageService    } from '../../services/local-storage.service';
import { GetLettersRandomService } from '../../services/get-data/get-letters-random.service';
import { RandomSimilarLetters   } from '../../classes/random-similar-letters';
import { SdGameDataService      } from '../../services/send-user-data/sd-game-data.service';
import { GameData, History } from '../../classes/game-data';
import { Store } from '@ngxs/store';

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
  dataToSend:       GameData[] = [];
  userData:         GameData;
  mcGameEl:         HTMLDivElement;
  lettersData:      RandomSimilarLetters;
  totalCorrects:    number;

  lastID: string;

  listenerRestartData:   any;
  listenerDetectMobile: any;

  letterSounds: any;

  constructor (
    private router:        Router,
    private _route:        ActivatedRoute,
    private getData:       GetLettersRandomService,
    private _sendData:     SdGameDataService,
    private detectMobile:  DetectMobileService,
    private _sound:        PreloadAudioService,
    private _storage:      LocalStorageService,
    private genDates:      GenerateDatesService,
    private speechService: SpeechSynthesisService,
    private store:         Store
  ) {

    this.success       = false;
    this.loading       = true;
    this.letterParam   = this._route.snapshot.paramMap.get('letter');
    this.urlToRedirect = `lectura/dibujar-letra/${this.letterParam}`;
  }

  ngAfterViewInit() {
    this.store.selectSnapshot(state => this.letterSounds = state.readingCourse.data.letterSounds );
    this.getLettersRandom();

  }


  ngOnInit() {
    setTimeout(e => this.showGame = true, 0);
    this._sound.loadAudio();

  }

  isMobile = () => this.detectMobile.isMobile();

  getLettersRandom = () => {
    this.getData.getSimilarLettersRandom(this.letterParam)
      .subscribe(
        (res: RandomSimilarLetters) => {

          this.lettersData = res;
          this.letter      = this.letterParam;

          this.letterIDs   = this.prepareData(this.lettersData.lowerCase);
          this.letters     = this.joinLetters(this.letterIDs);
          this.totalCorrects = this.countPendings();

          setTimeout(() => this.loading = false, 0);

          this.listenerRestartData  = () => setTimeout(() => this.restartData(), 0);
          this.listenerDetectMobile = () => setTimeout(() => this.isMobile(), 10);

          window.addEventListener('resize', this.listenerRestartData);
          window.addEventListener('resize', this.listenerDetectMobile);

          this.initUserData();
          this.instructions();

        },
        err => console.log(err)
      );
  }

  ngOnDestroy() {
    this.speechService.cancel();
    window.removeEventListener('resize', this.listenerRestartData);
    window.removeEventListener('resize', this.listenerDetectMobile);
  }

  prepareData = (letters: string[]) => {

    const array   = JSON.parse(JSON.stringify(letters));
    const width   = this.isMobile() ? 80 : 100;
    const columns = Math.floor(this.mcLetters.nativeElement.clientWidth / width);
    const missing = columns - (array.length % columns);

    for (let i = 0; i < missing; i++) {
      const element = `${array[i][0]}4${i}`;
      array.push(element);
    }

    const result = [];
    const max    = array.length / columns;

     for (let i = 0; i < columns; i++) {
      const el = array.splice(0, max);
      result.push(el);
    }
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
    this.clearEl           = {};
    this.elToDestroy       = '';
    this.restartCounters();

    setTimeout(() => {
      const letter = this.letter === this.letterParam.toLowerCase() ? 'lower' : 'upper';

      if (letter === 'lower') {

        this.letterIDs = this.prepareData(this.lettersData.lowerCase);
        this.letters   = this.joinLetters(this.letterIDs);

      } else {

        this.letterIDs = this.prepareData(this.lettersData.upperCase);
        this.letters   = this.joinLetters(this.letterIDs);

      }
    }, 50);


  }


  instructions = () => {

    this.countRepetitions();

    const type    = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const letter  = this.letterSounds[this.letterParam];
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
    this.opportunities = 0;
  }


  speak = (str: string) => {
    this.speechService.speak(str);
  }

  onSelect = (id: string) => {


    const letter      = id[0];
    const letterSound = this.letterSounds[this.letterParam];
    const type        = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msg         = `${letterSound} ${type}`;

    this.elToDestroy = letter === this.letter ? id : 'false';

    if (this.elToDestroy !== 'false') {

      this.succesCount++;
      this.lettersValidation[id] = id;
      this.clearEl[id] = id;

      this.addSelection(letter, true);
      const speak = this.speechService.speak(msg);



      this.removeElement(this.lastID);
      this.lastID = '';


      setTimeout(e => this.removeElement(id), 395);
      this.lastID = id;


      setTimeout(e =>  this.letters.indexOf(id) > -1 ? this.letters.splice(this.letters.indexOf(id), 1) : false, 500);

      // setTimeout(e => {
      //   const index = this.letters.indexOf(id);
      //   const i = index > -1 ? this.letters.splice(index, 1) : false;
      // }, 600);

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

  progress = (): number => {
    const total = 100;
    const t = total - (( this.countPendings() * 100 ) / this.totalCorrects);
    return t;
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
    this.totalCorrects = this.countPendings();

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


  /*---------- Collect Data  ------------*/
  initUserData = () => {

    const t = this.genDates.generateData();
    const id  = this._storage.getElement('user')['userId'];
    this.userData = new GameData(id, t.fullDate, t.fullTime, 'N/D', this.letter, this.countLetters(), 0, 0, [], []);
  }

  addSelection = (letter: string, status: boolean) => {

    const t = this.genDates.generateData().fullTime;
    this.userData.historial.push(new History(letter, t, status));

  }


  insertGroupOfSelection = () => {

    this.addFinalTime();
    const m = JSON.parse(JSON.stringify(this.userData));
    this.dataToSend.push(m);

  }


  addFinalTime = (): void => {

    this.userData.correct   = this.succesCount;
    this.userData.incorrect = this.failedCount;

    const t = this.genDates.generateData().fullTime;
    this.userData.finalTime = t;

  }

  countLetters = (): number => {

    let count = 0;
    this.letterIDs.forEach(g => g.forEach(e => e[0] === this.letter ? count++ : false ));
    return count;

  }

  countRepetitions = () => {
    const t = this.genDates.generateData().fullTime;
    this.userData.repetitions.push(t);
  }

  send = () => {

    this._sendData.sendGameData(this.dataToSend)
      .subscribe(
        val => {const v = val; },
        err => {const e = err; }
      );

  }


}
