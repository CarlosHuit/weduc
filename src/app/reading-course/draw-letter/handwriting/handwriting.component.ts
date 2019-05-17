import { Component, ViewChild, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Preferences, DrawLetterData } from 'src/app/store/models/reading-course/draw-letter/reading-course-draw-letter.model';
import { Observable, Subscription } from 'rxjs';
import { ListenHandwritingMsgDL } from 'src/app/store/actions/reading-course/reading-course-draw-letter.actions';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { Store, Select } from '@ngxs/store';
import { Coordinates } from 'src/app/classes/draw-letter-data';
import { AppState } from 'src/app/store/state/app.state';

@Component({
  selector: 'app-handwriting',
  templateUrl: './handwriting.component.html',
  styleUrls: ['./handwriting.component.css']
})

export class HandwritingComponent implements AfterViewInit, OnDestroy, OnInit {


  @ViewChild('canvasDraw') canvasEl: ElementRef;

  ctx:               CanvasRenderingContext2D;
  canvas:            HTMLCanvasElement;
  coordinatesLetter: Coordinates[][];
  coordinates:       Coordinates[][];
  preferences:       Preferences;
  timeOutsLine:      any[] = [];
  timeOutsGroup:     any[] = [];
  totalTimes:        number[] = [];
  tiempos:           any[]    = [];
  cw:                number;
  ch:                number;
  velocity:           number;

  sub1: Subscription;
  sub2: Subscription;

  @Select(AppState.isMobile)                   isMobile$: Observable<boolean>;
  @Select(AppState.queryMobileMatch)   queryMobileMatch$: Observable<boolean>;
  @Select(ReadingCourseState.dlPreferences) preferences$: Observable<Preferences>;
  @Select(ReadingCourseState.dlCurrentData) currentData$: Observable<DrawLetterData>;


  constructor(private store: Store ) { }

  ngAfterViewInit() {

    this.canvas = this.canvasEl.nativeElement;
    this.ctx    = this.canvas.getContext('2d');
    this.cw     = this.canvas.width = 300;
    this.ch     = this.canvas.height = 300;

    this.velocity  = 150;

  }

  ngOnInit() {

    this.sub1 = this.preferences$.subscribe(p => this.preferences = p);
    this.sub2 = this.currentData$.subscribe(data => {
      this.coordinates = data.coordinates,
      setTimeout(() => this.startExample(), 800);
    });

    window.addEventListener('resize', this.startExample);

  }

  ngOnDestroy() {

    this.sub1.unsubscribe();
    this.sub2.unsubscribe();

    this.limpiar();
    window.removeEventListener('resize', this.startExample);

  }

  setValues = () => {

    this.tiempos           = [];
    this.totalTimes        = [];
    this.timeOutsGroup     = [];
    this.timeOutsLine      = [];
    this.coordinatesLetter = [];
    this.coordinates.forEach((e, i) => this.coordinatesLetter[i] = [...e, e[e.length - 1]]);

  }


  draw = () => {

    let time = 0;

    if (this.coordinatesLetter.length > 0) {

      this.limpiar();
      this.generateTimes();

      this.ctx.lineWidth   = this.preferences.lineWidth;
      this.ctx.strokeStyle = this.preferences.lineColor;
      this.ctx.lineCap     = this.preferences.styleLine;


      for (let n = 0; n < this.coordinatesLetter.length; n++) {

        const element     = this.coordinatesLetter[n];
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

  failToDraw = () => console.log('Ha ocurrido un error');


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

    this.coordinatesLetter.forEach(e => {

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

    this.timeOutsGroup.forEach(e => clearTimeout(e));
    this.timeOutsLine.forEach(e => clearTimeout(e));

  }


}
