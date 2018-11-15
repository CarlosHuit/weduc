import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute       } from '@angular/router';
import { GetDataService               } from '../../services/get-data.service';
import { SpeechSynthesisService       } from '../../services/speech-synthesis.service';
import { GenerateDatesService         } from '../../services/generate-dates.service';
import { SendDataService              } from '../../services/send-data.service';
import { DetectMobileService          } from '../../services/detect-mobile.service';
import { PreloadAudioService          } from '../../services/preload-audio.service';
import { Words                        } from '../../interfaces/words';
import { LocalStorageService          } from '../../services/local-storage.service';
import { ShuffleService               } from '../../services/shuffle/shuffle.service';

interface GuessLetterData {
  user_id?: string;
  date?: string;
  startTime?: string;
  finalTime?: string;
  letter?: string;
  words?: Options[];
}

interface Options {
  word?: string;
  startTime?: string;
  finalTime?: string;
  correct?: number;
  incorrect?: number;
  pressImage: number;
  repetitions: number;
  historial?: Selection[];
}

interface Selection {
  letter?: string;
  time?: string;
  status?: boolean;
}



@Component({
  selector: 'app-find-letter',
  templateUrl: './find-letter.component.html',
  styleUrls: ['./find-letter.component.css']
})
export class FindLetterComponent implements OnInit, OnDestroy {

  userData: GuessLetterData = {};

  words: string[];
  letters: string[];
  arrayIDs: string[];
  letterParam: string;
  urlImage: string;
  word: string;
  loading: boolean;
  success: boolean;

  selection = {};
  showC: boolean;

  constructor(
    private router:   Router,
    private _route:   ActivatedRoute,
    private getData:  GetDataService,
    private speech:   SpeechSynthesisService,
    private genDates: GenerateDatesService,
    private sendData: SendDataService,
    private _mobile:  DetectMobileService,
    private _sound:   PreloadAudioService,
    private _storage: LocalStorageService,
    private _shuffle: ShuffleService,
  ) {
    this.loading = true;
    this.letterParam = this._route.snapshot.paramMap.get('letter');
  }

  ngOnInit() {
    this.setValues();
    this._sound.loadAudio();
    window.addEventListener('resize', this.isMobile);
  }

  ngOnDestroy() {
    this.speech.cancel();
    window.removeEventListener('resize', this.isMobile);
  }

  setValues = () => {

    if (Storage) {

      const words = this._storage.getElement(this.letterParam);

      if (words !== null) {

        this.words = this._shuffle.mess(words);
        this.initUserData();
        this.changeDates(this.words[0]);
        this.loading = false;
        setTimeout(() => this.showC = true, 10);
        this.instructions();


      } else { this.getServerData(); }

    } else { this.getServerData(); }

  }


  getServerData = () => {
    this.getData.getWords(this.letterParam)
      .subscribe(
        (word: Words) => {

          if (word.words === undefined) {

            this.speech.speak('ha habido un error');

          } else {

            this.words = word.words.sort(() => Math.random() - 0.5);
            this.initUserData();

            this.changeDates(this.words[0]);
            this.instructions();


            if (Storage) {
              localStorage.setItem(this.letterParam, JSON.stringify(this.words));
            }
          }

        },

        (err) => console.log(err)

      );
  }

  isMobile = (): boolean => {
    return this._mobile.isMobile();
  }

  pendingLetters = () => {

    let count = 0;

    this.arrayIDs.forEach(e => {
      const letter = e[0];
      const validation = letter === this.letterParam.toLowerCase() || letter === this.letterParam.toUpperCase() ? true : false;

      if (validation === true) {
        const x = this.selection[e] !== e ? count++ : false;
      }

    });

    return count;
  }

  removeClass = () => this.selection = {};

  onSelect = (id: string) => {

    const txt        = id[0];
    const validation = txt === this.letterParam.toLowerCase() || txt === this.letterParam.toUpperCase();

    if (validation) {

      this.addData(this.word, 2020, txt, true);

      if (this.selection[id] !== id) { this.selection[id] = id; }

      const p      = this.pendingLetters();
      const speech = this.speech.speak('Correcto');

      speech.addEventListener('end', e => { const x = p === 0 ? this.next() : false; });

    } else {

      this.addData(this.word, 2020, txt, false);
      this._sound.playAudio();

    }
  }

  next = () => {

    this.addData(this.word, 2011);

    this.success    = true;
    const nextIndex = this.words.indexOf(this.word) + 1;
    const x         = nextIndex < this.words.length ? this.changeWord(nextIndex) : this.redirect();

  }

  changeWord = (index: number) => {

    this.removeClass();
    this.changeDates(this.words[index]);

    const speech = this.speech.speak('Bien Hecho!', 0.85);
    speech.addEventListener('end', e => {
      this.success = false;
      this.instructions();
    });

  }

  redirect = () => {

    this.addFinalTimeComponent();
    this.send();

    this.success = true;

    const url = `/leer/select-words/${this.letterParam}`;
    const msg = 'Lo has hecho muy bien.. continuemos.';
    const speech = this.speech.speak(msg);

    speech.addEventListener('end', e => this.router.navigateByUrl(url));

  }

  generateArrayIDs = () => {

    this.arrayIDs = [];
    for (let i = 0; i < this.letters.length; i++) {
      this.arrayIDs.push(`${this.letters[i]}${i}`);
    }

  }

  instructions = () => {

    this.addData(this.word, 2015);
    const s   = this._storage.getElement('letter_sounds')[this.letterParam];
    const msg = `Selecciona todas las letras ... ${s} ... de la palabra ... ${this.word}`;

    setTimeout(() =>  this.speech.speak(msg), 500);

  }

  changeDates = (word: string) => {

    this.word     = word;
    this.letters  = this.word.split('');
    this.urlImage = this.generateUrlImage(this.word);
    this.generateArrayIDs();

    this.addData(this.word, 2010);

  }

  generateUrlImage = (name: string) => `/assets/img-min/${name}-min.png`;

  speak = () => {
    this.addData(this.word, 2014);
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

  initUserData = () => {

    const time = this.genDates.generateData();

    this.userData['user_id'] = 'N/A';
    this.userData['date'] = time.fullDate;
    this.userData['startTime'] = time.fullTime;
    this.userData['finalTime'] = 'N/A';
    this.userData['letter'] = this.letterParam;
    this.userData.words = this.fillOptions();

  }

  addData = (word: string, code: number, letter?: string, state?: boolean) => {

    const time = this.genDates.generateData();

    for (const i in this.userData.words) {
      if (this.userData.words.hasOwnProperty(i)) {
        const el = this.userData.words[i];

        if (el.word === word) {

          switch (code) {
            case 2010:
              el.startTime = time.fullTime;
              break;
            case 2011:
              el.finalTime = time.fullTime;
              break;
            case 2012:
              el.correct++;
              break;
            case 2013:
              el.incorrect++;
              break;
            case 2014:
              el.pressImage++;
              break;
            case 2015:
              el.repetitions++;
              break;
            case 2016:
              el.historial.push();
              break;
            case 2020:

              el.historial.push(this.generateSelection(letter, state));
              const x = state === true ? el.correct++ : el.incorrect++;

              break;

            default:
              break;
          }

        }

      }
    }

  }

  fillOptions = (): Options[] => {

    const result = [];

    this.words.forEach(word => {
      const xx: Options = {
        word: word,
        startTime: 'N/A',
        finalTime: 'N/A',
        correct: 0,
        incorrect: 0,
        pressImage: 0,
        repetitions: 0,
        historial: []
      };
      result.push(xx);
    });

    return JSON.parse(JSON.stringify(result));

  }

  generateSelection = (letter: string, state: boolean): Selection => {

    const time = this.genDates.generateData();
    const x = { letter: letter, time: time.fullTime, status: state, };

    return JSON.parse(JSON.stringify(x));
  }

  addFinalTimeComponent = (): void => {
    const time = this.genDates.generateData();
    this.userData['finalTime'] = time.fullTime;
  }

  send = () => {
    this.sendData.sendGuessLetterData(this.userData)
      .subscribe(
        val => console.log(val),
        err => console.log(err)
      );
  }

}



const t = [
'bicicleta',
'impresora',
'serpiente',
'sombrilla',
'unicornio',
'waterpolo',
'zanahoria',
'zapatilla',
'zoológico',
'aguacate',
'boxeador',
'diamante',
'edificio',
'elefante',
'escalera',
'estrella',
'gelatina',
'guitarra',
'mariposa',
'pantalla',
'paraguas',
'querubín',
'semáforo',
'sombrero',
'teléfono',
'uniforme',
'universo',
'xilófono',
'Francia',
'ardilla',
'ballena',
'caballo',
'campana',
'fósforo',
'gallina',
'hormiga',
'iglesia',
'juguete',
'karaoke',
'lagarto',
'medalla',
'naranja',
'palmera',
'química',
'raqueta',
'saxofón',
'tenedor',
'ventana',
'vestido',
'walkman',
'Walter',
'anillo',
'biblia',
'camión',
'conejo',
'delfín',
'doctor',
'duende',
'escoba',
'espejo',
'flauta',
'fuente',
'guante',
'gusano',
'harina',
'helado',
'iguana',
'jaguar',
'jarrón',
'jirafa',
'karate',
'kimono',
'kiosco',
'molino',
'payaso',
'pelota',
'piñata',
'quemar',
'querer',
'tambor',
'tijera',
'tomate',
'urbano',
'viento',
'volcán',
'waffle',
'webcam',
'yogurt',
'yunque',
'zapato',
'zapote',
'abeja',
'avión',
'baile',
'barco',
'burro',
'carro',
'dulce',
'elote',
'fresa',
'fruta',
'fuego',
'globo',
'gorra',
'hielo',
'hueso',
'huevo',
'indio',
'jabón',
'jaula',
'koala',
'libro',
'limón',
'lápiz',
'momia',
'mundo',
'nariz',
'oreja',
'otoño',
'otoño',
'oveja',
'queso',
'ratón',
'reloj',
'rueda',
'silla',
'tigre',
'zorro',
'éxito',
'ñandú',
'agua',
'arpa',
'bota',
'cama',
'casa',
'coco',
'dado',
'dedo',
'flor',
'gato',
'hilo',
'idea',
'iglú',
'imán',
'isla',
'jugo',
'kilo',
'kiwi',
'lago',
'leña',
'lima',
'lobo',
'luna',
'mano',
'mapa',
'mesa',
'moño',
'nave',
'nido',
'niña',
'niño',
'nube',
'olla',
'pato',
'pera',
'rana',
'rosa',
'sapo',
'sopa',
'taxi',
'taxi',
'taza',
'uvas',
'vaca',
'vaso',
'vela',
'vino',
'yate',
'yema',
'yeso',
'yoyo',
'ñoño',
'ojo',
'ola',
'oro',
'oso',
'rey',
'sol',
'uno',
'uña',

];
