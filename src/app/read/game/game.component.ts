import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { GenerateDatesService } from '../../services/generate-dates.service';
import { SendDataService } from '../../services/send-data.service';
import { DetectMobileService } from '../../services/detect-mobile.service';
import { GetDataService, RandomSimilarLetters } from '../../services/get-data.service';
import { HttpResponse } from '@angular/common/http';
import { PreloadAudioService } from '../../services/preload-audio.service';

interface Option {
  user_id?: string;
  date?: string;
  startTime?: string;
  letter?: string;
  amount?: number;
  correct?: number;
  incorrect?: number;
  repetitions?: number;
  historial?: Record[];
  finalTime?: string;

}

interface Record {
  letter?: string;
  time?: string;
  status?: boolean;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('canvas')    canvasEl:     ElementRef;
  @ViewChild('mcGame')    mcGame:       ElementRef;
  @ViewChild('mcLetters') mcLetters:    ElementRef;

  opportunities = 0;
  failedCount = 0;
  succesCount = 0;
  loading: boolean;
  success: boolean;


  lettersValidation = {};
  letters:      string[];
  arrayIDs:     string[] = [];
  letterParam:  string;
  elToDestroy:  string;
  letter:       string;
  show =        false;
  userData:    Option = {};
  mcGameEl:    HTMLDivElement;
  canvas:      HTMLCanvasElement;
  canvas2:     HTMLCanvasElement;
  lettersData: RandomSimilarLetters;
  ctx:         CanvasRenderingContext2D;
  ctx2:        CanvasRenderingContext2D;

  dataToSend   = [];
  clearEl: any = {};
  isMobile:  boolean;
  letterIDs: string[][];


  constructor(
    private router:        Router,
    private speechService: SpeechSynthesisService,
    private _route:        ActivatedRoute,
    private genDates:      GenerateDatesService,
    private sendData:      SendDataService,
    private detectMobile:  DetectMobileService,
    private getData:       GetDataService,
    private _sound:        PreloadAudioService
  ) {

    this.success = false;
    this.loading = true;
    this.letterParam = this._route.snapshot.paramMap.get('letter');
    this.isMobile = this.detectMobile.isMobile();
  }

  ngAfterViewInit() {
   const t = this.isMobile === true ? this.activeCanvas() : false;
  }


  ngOnInit() {

    this.getLettersRandom();
    this._sound.loadAudio();


    if (this.isMobile) {
      window.addEventListener('orientationchange', e => setTimeout(() => this.restartCanvas(), 50));
    }

    window.addEventListener('orientationchange', e => setTimeout(() => this.restartData(), 100));


  }


  activeCanvas = () => {
    this.canvas = this.canvasEl.nativeElement;
    this.ctx    = this.canvas.getContext('2d');
    this.canvas2  = document.createElement('canvas');
    this.ctx2     = this.canvas2.getContext('2d');

    this.mcGameEl = this.mcGame.nativeElement;
    this.s();
  }

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

  prepareData = (letters: string[]): string[][] => {

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

        this.letterIDs   = this.prepareData(this.lettersData.lowerCase);
        this.letters     = this.joinLetters(this.letterIDs);

      } else {

        this.letterIDs   = this.prepareData(this.lettersData.upperCase);
        this.letters     = this.joinLetters(this.letterIDs);

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

    const url = `/leer/identificar-letra/${this.letterParam}`;
    const speech = this.speechService.speak('"Bien Hecho!"', .9);

    speech.addEventListener('end', e => this.router.navigateByUrl(url));

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


  s = () => {

    const ctx = this.ctx;
    const w   = this.canvas.width  = this.mcGameEl.clientWidth;
    const h   = this.canvas.height = this.mcGameEl.clientHeight - 40;

    const hue      = 217;
    const stars    = [];
    const maxStars = 1000; // 1400
    let count      = 0;

    const canvas2  = this.canvas2;
    const ctx2     = this.ctx2;
    canvas2.width  = 100;
    canvas2.height = 100;

    const half = canvas2.width / 2;
    const gradient = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0.025, '#fff');
    gradient.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`);
    gradient.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`);
    gradient.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    function random(min, max?) {

      if (arguments.length < 2) {
        max = min;
        min = 0;
      }

      if (min > max) {
        const hold = max;
        max = min;
        min = hold;
      }

      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const maxOrbit = ( x, y ) => {
      const max = Math.max(x, y );
      const diameter = Math.round(Math.sqrt( max * max + max * max ));
      return diameter / 2;
    };

    const Star = function () {

      this.orbitRadius = random(maxOrbit( w, h));
      this.radius = random(60, this.orbitRadius) / 12;
      this.orbitX = w / 2;
      this.orbitY = h / 2;
      this.timePassed = random(0, maxStars);
      this.speed = random(this.orbitRadius) / 150000; // 500000
      this.alpha = random(2, 10) / 10;

      count++;
      stars[count] = this;
    };

    Star.prototype.draw = function() {

      const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
      const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
      const twinkle = random(10);

      const c = twinkle === 1 && this.alpha > 0 ? this.alpha -= 0.05 : false;
      const t = twinkle === 2 && this.alpha < 1 ? this.alpha += 0.05 : false;

      ctx.globalAlpha = this.alpha;
      ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
      this.timePassed += this.speed;
    };

    for (let i = 0; i < maxStars; i++) {
      const t = new Star();
    }

    const animation = () => {

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = `hsla(${hue}, 64%, 6%, 1)`;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      stars.forEach(star => star.draw());

      window.requestAnimationFrame(animation);
    };

    animation();
  }

  restartCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
  }

}
