import { Component, ViewChild, OnInit, Output, ElementRef, AfterViewInit, Input, OnDestroy, EventEmitter } from '@angular/core';
import { SpeechSynthesisService } from '../../../services/speech-synthesis.service';
import { GenerateDatesService   } from '../../../services/generate-dates.service';
import { DetectMobileService   } from '../../../services/detect-mobile.service';
import { Store } from '@ngxs/store';

interface HandwritingData {
  startTime?:  string;
  repetition?: string[];
  nextTime?:   string;

}

@Component({
  selector: 'app-handwriting',
  templateUrl: './handwriting.component.html',
  styleUrls: ['./handwriting.component.css']
})

export class HandwritingComponent implements AfterViewInit, OnDestroy, OnInit {


  @Input() coordinates:    any;
  @Input() letter:         string;
  @Input() lineWidth:      number;
  @Input() lineColor:      string;
  @Input() showGuidLines:  boolean;

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
  colors:       string[];
  timeClear:    any;
  info:         any[] = [];
  tiempos:      any[] = [];
  totalTimes:   any[] = [];
  timeOutsLine        = [];
  timeOutsGroup       = [];
  // showGuidLines       = true;

  userData: HandwritingData = {};
  letterSounds: any;


  constructor(
    private speechSynthesis: SpeechSynthesisService,
    private genDates:        GenerateDatesService,
    private _mobile:         DetectMobileService,
    private store: Store
  ) {
    this.store.selectSnapshot(state => this.letterSounds = state.readingCourse.data.letterSounds );
  }

  ngAfterViewInit() {

    this.canvas = this.canvasEl.nativeElement;
    this.ctx    = this.canvas.getContext('2d');
    this.cw     = this.canvas.width = 300;
    this.ch     = this.canvas.height = 300;


    this.smoothing = 5;
    this.styleLine = 'round';
    this.velocity  = 150;

    this.startExample();
  }

  ngOnInit() {

    window.addEventListener('resize', this.startExample);

  }

  ngOnDestroy() {
    this.speechSynthesis.cancel();
    window.removeEventListener('resize', this.startExample);
  }

  setValues = () => {

    this.tiempos       = [];
    this.totalTimes    = [];
    this.timeOutsGroup = [];
    this.timeOutsLine  = [];

    this.info = this.coordinates;
    this.type = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';

    this.info.forEach(e => e.push(e[e.length - 1]));

  }

  changeColor = (color: string): void => {
    this.lineColor = color;
    this.startExample();
  }

  hide = () => {

    const data = JSON.stringify(this.userData);

    this.evsHandWriting.emit(data);

    const type  = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const sound = this.letterSounds[this.letter.toLowerCase()];
    const msg   = `Bien, ahora practica escribir la letra: .... ${sound} ..... ${type}`;

    this.speechSynthesis.speak(msg);
    this.limpiar();
  }

  repeat = () => {
    this.evsHandWriting.emit('repeat');
    this.startExample();
  }

  draw = (): void => {

    let time = 0;

    if (this.info.length > 0) {

      this.limpiar();
      this.generateTimes();

      this.ctx.lineWidth   = this.lineWidth;
      this.ctx.strokeStyle = this.lineColor;
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

      this.faisToDraw();

    }

  }

  faisToDraw = () => {


    const type  = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const sound = this.letterSounds[this.letter.toLowerCase()];
    const msg   = `Por ahora no puedo mostrarte como escribir la letra: ${sound} .... "${type}"`;

    this.speechSynthesis.speak(msg);

  }

  isMobile = () => this._mobile.isMobile();

  startExample = () => {

    this.limpiar();
    this.setValues();

    const type   = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const sound  = this.letterSounds[this.letter.toLowerCase()];
    const msg    = `Mira atentamente, así se escribe la letra: ... ${sound} .... "${type}"`;
    const speech = this.speechSynthesis.speak(msg);

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

  genSizes = (el: HTMLDivElement) => {

    const width  = el.clientWidth;
    const height = el.clientHeight;

    if  (width < height) {

      return {
        width:  `${width * .90}px`,
        height: `${width * .90}px`
      };

    } else {

      return {
        width:  `${height * .90}px`,
        height: `${height * .90}px`
      };

    }
  }

}