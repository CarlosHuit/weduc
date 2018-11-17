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

export interface DrawLetterData {
  user_id?: string;
  date?: string;
  startTime?: string;
  finalTime?: string;
  letter?: string;
  boardData?: {}[];
  handWritingData?: {}[];
}

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
  userData: DrawLetterData = {};

  data = [];

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



  showBoardC = (ev) => {

    const data = JSON.parse(ev);
    this.userData.handWritingData.push(data);

    this.showBoard = true;
    this.handWriting.limpiar();
    this.boardComponent.limpiar();
    this.boardComponent.initUserData();

  }

  showHandWriting = (ev?) => {

    const data = JSON.parse(ev);
    this.userData.boardData.push(data);

    this.showBoard = false;
    this.handWriting.limpiar();
    this.handWriting.initUserData();
    this.handWriting.startExample();

  }

  isMobile = (): boolean => {
    return this.dMobile.isMobile();
  }

  next = (ev) => {

    const data = JSON.parse(ev);
    this.userData.boardData.push(data);
    this.addFinalTime();


    const nextIndex = this.letters.indexOf(this.currentLetter) + 1;
    const type      = this.currentLetter === this.currentLetter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const sound     = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLowerCase()];
    const msg       = `Bien, ahora ya sabes escribir la letra: ${sound} .... "${type}"`;


    if (nextIndex < this.letters.length) {

      this.success = true;
      this.showBoard = false;
      this.changeData(nextIndex);


      const d = JSON.parse(JSON.stringify(this.userData));
      this.data.push(d);
      this.initUserData();

      const speech = this.speech.speak(msg);
      speech.addEventListener('end', e => this.nextLetter());

    } else {

      this.success = true;
      const d = JSON.parse(JSON.stringify(this.userData));
      this.data.push(d);

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
    this.handWriting.initUserData();
    this.handWriting.startExample();

  }

  redirect = (): void => {

    const url = `lectura/encontrar-letras/${this.letterParam}`;
    this.router.navigateByUrl(url);

  }

  initUserData = () => {
    const t = this.genDates.generateData();

    this.userData['user_id'] = 'N/A';
    this.userData['startTime'] = t.fullTime;
    this.userData['date'] = t.fullDate;
    this.userData['letter'] = this.currentLetter;
    this.userData['finalTime'] = 'N/A';
    this.userData['boardData'] = [];
    this.userData['handWritingData'] = [];

  }

  addFinalTime = () => {
    const t = this.genDates.generateData();
    this.userData['finalTime'] = t.fullTime;
  }

  sendDrawLetterData = (obj: DrawLetterData[]) => {
    this.sendData.sendDrawLetterData(obj)
      .subscribe(
        val => console.log(val),
        err => console.log(err)
      );
  }

}
