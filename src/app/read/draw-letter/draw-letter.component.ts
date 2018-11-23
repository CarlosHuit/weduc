import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CoordinatesService, Coordinates  } from '../../services/coordinates.service';
import { Router, ActivatedRoute           } from '@angular/router';
import { HandwritingComponent             } from '../handwriting/handwriting.component';
import { BoardComponent                   } from '../board/board.component';
import { SpeechSynthesisService           } from '../../services/speech-synthesis.service';
import { GenerateDatesService             } from '../../services/generate-dates.service';
import { SendDataService                  } from '../../services/send-data.service';
import { DetectMobileService              } from '../../services/detect-mobile.service';
import { LocalStorageService              } from '../../services/local-storage.service';
import { DrawLetterData                   } from '../../interfaces/draw-letter-data';
import { DrawLettersData, Board           } from '../../classes/draw-letter-data';
import { ControlCanvas                    } from '../../classes/control-canvas';

@Component({
  selector: 'app-draw-letter',
  templateUrl: './draw-letter.component.html',
  styleUrls: ['./draw-letter.component.css']
})

export class DrawLetterComponent implements OnInit, OnDestroy {

  @ViewChild(HandwritingComponent) handWriting: HandwritingComponent;
  @ViewChild(BoardComponent) boardComponent: BoardComponent;

  letters:        string[] = [];
  letterParam:    string;
  currentLetter:  string;
  urlToRedirect:  string;
  loading:        boolean;
  showBoard:      boolean;
  showDraw:       boolean;
  coordinates:    any;
  success =       false;
  currentCoordinates:        {};

  userData:       DrawLettersData;
  data:           DrawLettersData[] = [];

  colors:         string[];
  lineWidth:      number;
  lineColor:      string;
  showGuidLines:  boolean;

  constructor(
    private coordinatesService: CoordinatesService,
    private _route:             ActivatedRoute,
    private router:             Router,
    private speech:             SpeechSynthesisService,
    private genDates:           GenerateDatesService,
    private sendData:           SendDataService,
    private dMobile:            DetectMobileService,
    private _storage:           LocalStorageService
  ) {
    this.letterParam   = this._route.snapshot.paramMap.get('letter');
    this.loading       = true;
    this.showDraw      = false;
    this.colors        = ['#f44336', '#009494', '#007cc0', '#fc793c'].sort(e => Math.random() - 0.5);
    this.lineWidth     = 14;
    this.lineColor     = '#007cc0';
    this.lineColor     = this.colors[0];
    this.showGuidLines = true;
    this.urlToRedirect = `lectura/encontrar-letras/${this.letterParam}`;
  }

  ngOnInit() {
    this.setValues();
    window.addEventListener('resize', this.isMobile);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.isMobile);
  }

  setValues = () => {

    this.letters.push(this.letterParam.toUpperCase());
    this.letters.push(this.letterParam.toLowerCase());
    this.currentLetter = this.letters[0];

    const val1 = this._storage.getElement(`${this.letterParam}_coo`);
    const val2 = this._storage.getElement(`${this.letterParam}_coo`);

    if (val1 !== null || val2 !== null) {

      this.getLocalStorageData();

    } else {

      this.getCoordinates();

    }

  }

  getCoordinates = () => {
    this.coordinatesService.getCoordinates(this.letterParam)
      .subscribe(
        (coordinates: Coordinates) => {

          this.coordinates        = coordinates;
          this.currentCoordinates = this.coordinates.coordinates[this.currentLetter];
          this.loading            = false;
          setTimeout(() =>  this.showDraw = true , 10);
          this.initUserData();

        }
      );
  }

  getLocalStorageData = () => {

    this.coordinates        = this.coordinatesService.getCoordinatesOfStorage(this.letterParam);
    this.currentCoordinates = this.coordinates.coordinates[this.currentLetter];
    this.loading            = false;

    setTimeout(() =>  this.showDraw = true , 10);
    this.initUserData();

  }

  eventsControlCanvas = (ev: ControlCanvas) => {
    const x = ev;
    this.lineColor = ev.color;
    this.lineWidth = ev.lineWidth;
    this.showGuidLines = ev.showGuideLines;
    this.boardComponent.limpiar();
  }

  eventsHandWriting = (ev) => {

    if ( ev === 'repeat' ) {
      this.addRepeatTime();
    } else {

      this.showBoard = true;
      this.handWriting.limpiar();
      this.boardComponent.limpiar();

    }

  }

  eventsBoard = (ev?) => {

    if (ev === 'repeat') {

      this.addRepeatTime();
      this.showHandWritingAndAnimate();

    } else {

      const data     = JSON.parse(ev);
      const d: Board = data.boardData;

      if (data.showHandwriting === true) {

        this.userData.board.push(d);
        this.showHandWritingAndAnimate();

      } else {

        this.userData.board.push(d);

      }

    }


  }

  showHandWritingAndAnimate = () => {

    this.showBoard = false;
    this.handWriting.limpiar();
    this.handWriting.startExample();

  }

  isMobile = (): boolean => {
    return this.dMobile.isMobile();
  }

  next = (ev) => {
    this.addFinalTime();
    this.data.push(JSON.parse(JSON.stringify(this.userData)));
    console.log(this.data);


    const nextIndex = this.letters.indexOf(this.currentLetter) + 1;
    const type      = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const sound     = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLowerCase()];
    const msg       = `Bien, ahora ya sabes escribir la letra: ${sound} .... "${type}"`;


    if (nextIndex < this.letters.length) {

      this.success = true;
      this.showBoard = false;
      this.changeData(nextIndex);
      this.initUserData();

      const speech = this.speech.speak(msg);
      speech.addEventListener('end', e => this.nextLetter());

    } else {

      this.success = true;
      this.sendDrawLetterData(this.data);

      const speech = this.speech.speak(msg);
      speech.addEventListener('end', this.redirect);

    }
  }

  changeData = (index: number) => {

    this.currentLetter = this.letters[index];
    this.currentCoordinates = this.coordinates.coordinates[this.currentLetter];

  }

  nextLetter = () => {

    this.success = false;
    this.handWriting.limpiar();
    this.handWriting.startExample();

  }

  redirect = (): void => {

    const url = `lectura/encontrar-letras/${this.letterParam}`;
    this.router.navigateByUrl(url);

  }

  initUserData = () => {
    const t  = this.genDates.generateData();
    const id = this._storage.getElement('user')['userId'];

    this.userData = new DrawLettersData(id, t.fullTime, 'N/A', t.fullDate, this.currentLetter, [], []);

  }

  addRepeatTime = () => {

    const t = this.genDates.generateData().fullTime;
    this.userData.handWriting.push(t);

  }

  addFinalTime = () => {

    const t = this.genDates.generateData().fullTime;
    this.userData.finalTime = t;

  }

  sendDrawLetterData = (obj: DrawLetterData[]) => {
    // this.sendData.sendDrawLetterData(obj)
    //   .subscribe(
    //     val => console.log(val),
    //     err => console.log(err)
    //   );

    console.log(this.data);
  }

}
