import { Component, ViewChild, OnInit, Output, ElementRef, AfterViewInit, Input, OnDestroy, EventEmitter } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { AppState } from 'src/app/store/state/app.state';
import { Observable } from 'rxjs';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { Preferences, DrawLetterData } from 'src/app/store/models/reading-course/draw-letter/reading-course-draw-letter.model';
import { Coordinates } from 'src/app/classes/draw-letter-data';
import { ListenHandwritingMsgDL } from 'src/app/store/actions/reading-course/reading-course-draw-letter.actions';

@Component({
  selector: 'app-handwriting',
  templateUrl: './handwriting.component.html',
  styleUrls: ['./handwriting.component.css']
})

export class HandwritingComponent implements AfterViewInit, OnDestroy, OnInit {


  coordinates:    Coordinates[][];
  letter:         string;

  @Output() evsHandWriting = new EventEmitter<string>();
  @ViewChild('canvasDraw') canvasEl: ElementRef;

  private ctx:    CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  cw:           number;
  ch:           number;
  smoothing:    number;
  velocity:     number;
  styleLine:    string;
  type:         string;
  timeClear:    any;
  info:         Coordinates[][];
  tiempos:      any[] = [];
  totalTimes:   any[] = [];
  timeOutsLine        = [];
  timeOutsGroup       = [];

  preferences: Preferences;

  @Select(AppState.isMobile)                   isMobile$: Observable<boolean>;
  @Select(AppState.queryMobileMatch)   queryMobileMatch$: Observable<boolean>;
  @Select(ReadingCourseState.dlPreferences) preferences$: Observable<Preferences>;
  @Select(ReadingCourseState.currentLetter) currentLetter$: Observable<string>;
  @Select(ReadingCourseState.dlCurrentData) currentData$:   Observable<DrawLetterData>;


  constructor(private store: Store) { }

  ngAfterViewInit() {

    this.canvas = this.canvasEl.nativeElement;
    this.ctx    = this.canvas.getContext('2d');
    this.cw     = this.canvas.width = 300;
    this.ch     = this.canvas.height = 300;


    this.smoothing = 5;
    this.styleLine = 'round';
    this.velocity  = 150;

  }

  ngOnInit() {

    this.preferences$.subscribe(p => this.preferences = p);
    this.currentData$.subscribe(data => this.coordinates = data.coordinates);
    this.currentLetter$.subscribe(letter => this.letter = letter);

    window.addEventListener('resize', this.startExample);
    setTimeout(() => this.startExample(), 500);

  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.startExample);
  }

  setValues = () => {

    this.tiempos       = [];
    this.totalTimes    = [];
    this.timeOutsGroup = [];
    this.timeOutsLine  = [];

    this.info = JSON.parse(JSON.stringify(this.coordinates));
    this.type = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';

    this.info.forEach(e => e.push(e[e.length - 1]));

  }

  // const msg   = `Bien, ahora practica escribir la letra: .... ${sound} ..... ${type}`;

  repeat = () => this.startExample();

  draw = (): void => {

    let time = 0;

    if (this.info.length > 0) {

      this.limpiar();
      this.generateTimes();

      this.ctx.lineWidth   = this.preferences.lineWidth;
      this.ctx.strokeStyle = this.preferences.lineColor;
      this.ctx.lineCap     = this.styleLine as any;


      for (let n = 0; n < this.info.length; n++) {

        const element     = this.info[n];
        const currentTime = this.getTotalTime(n);
        time             += this.getTotalTime(n + 1);
        const tiempos     = this.tiempos[n];

        let prevX = element[0].x;
        let prevY = element[0].y;

        const tg = setTimeout(() => {

          for (let i = 0; i < element.length - 1; i++) {

            const tt = setTimeout(() => {

              const pc = this.calcControlPoint(element, i, i + 1);

              this.ctx.beginPath();
              this.ctx.moveTo(prevX, prevY);
              this.ctx.quadraticCurveTo(element[i].x, element[i].y, pc.x, pc.y);
              this.ctx.stroke();

              prevX = pc.x;
              prevY = pc.y;

            }, tiempos[i]);

            this.timeOutsLine.push(tt);
          }
        }, currentTime);
        this.timeOutsGroup.push(tg);
      }

    } else {

      this.failToDraw();

    }

  }

  failToDraw = () => {


    // const type  = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    // const sound = this.letterSounds[this.letter.toLowerCase()];
    // const msg   = `Por ahora no puedo mostrarte como escribir la letra: ${sound} .... "${type}"`;
    console.log('Por ahora no puedo mostrarte como escribir la letra');
    // this.speechSynthesis.speak(msg);

  }


  startExample = () => {

    this.limpiar();
    this.setValues();

    this.store.dispatch(new ListenHandwritingMsgDL());
    setTimeout(e => this.draw(), 500);


  }

  getTotalTime = (position: number) => {

    let suma = 0;
    for (let x = 0; x < position + 1; x++) {
      const element = this.totalTimes[x];
      suma += element;
    }

    return suma;
  }

  individualStrokeTimes = (obj) => {

    const tiempos = [];
    let time = 0;

    obj.forEach(el => (tiempos.push(time), time += this.velocity));

    return tiempos;
  }

  generateTimes = () => {

    this.tiempos.length = 0;
    this.totalTimes.push(10);

    this.info.forEach(e => {

      const times = this.individualStrokeTimes(e);
      this.tiempos.push(times);

      const totalTime = this.totalTimeToDraw(times) + 100;
      this.totalTimes.push(totalTime);

    });

  }

  totalTimeToDraw = (obj: number[]) => {
    const i = obj.length - 1;
    return obj[i];
  }

  calcControlPoint = (el, a, b) => {

    const pointControl = { x: 0, y: 0 };

    pointControl.x = (el[a].x + el[b].x) / 2;
    pointControl.y = (el[a].y + el[b].y) / 2;

    return pointControl;

  }


  limpiar = () => {

    this.ctx.clearRect(0, 0, this.cw, this.ch);

    clearTimeout(this.timeClear);
    this.timeOutsGroup.forEach(e => clearTimeout(e));
    this.timeOutsLine.forEach(e => clearTimeout(e));

  }


}
