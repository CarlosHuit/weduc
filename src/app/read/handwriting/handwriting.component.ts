import { Component, ViewChild, OnInit, Output, ElementRef, AfterViewInit, Input, OnDestroy, EventEmitter } from '@angular/core';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { GenerateDatesService } from '../../services/generate-dates.service';

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


  @Input() coordinates: any;
  @Input() letter: string;

  @ViewChild('canvasDraw') canvasEl: ElementRef;
  @Output() propagar = new EventEmitter<string>();

  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  cw: number;
  ch: number;
  lineWidth: number;
  lineColor: string;
  styleLine: string;
  smoothing: number;

  type: string;
  info: any[] = [];
  tiempos: any[] = [];
  totalTimes: any[] = [];
  velocity: number;
  timeClear: any;

  // stateDisabled = true;
  timeOutsLine = [];
  timeOutsGroup = [];

  userData: HandwritingData = {};


  constructor(
    private speechSynthesis: SpeechSynthesisService,
    private genDates: GenerateDatesService
  ) {
  }

  ngAfterViewInit() {
  }

  ngOnInit() {

    this.canvas = this.canvasEl.nativeElement;
    this.ctx    = this.canvas.getContext('2d');
    this.cw     = this.canvas.width = 300;
    this.ch     = this.canvas.height = 300;


    this.smoothing = 5;
    this.lineWidth = 14;
    this.lineColor = '#007cc0';
    this.styleLine = 'round';
    this.velocity  = 150;

    this.initUserData();
    this.startExample();

  }

  ngOnDestroy() {
    this.speechSynthesis.cancel();
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

  hide = () => {

    this.addnextTime();
    const data = JSON.stringify(this.userData);

    this.propagar.emit(data);

    const type  = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const sound = JSON.parse(localStorage.getItem('letter_sounds'))[this.letter.toLowerCase()];
    const msg   = `Bien, ahora practica escribir la letra: .... ${sound} ..... ${type}`;

    this.speechSynthesis.speak(msg);
    this.limpiar();
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
    const sound = JSON.parse(localStorage.getItem('letter_sounds'))[this.letter.toLowerCase()];
    const msg   = `Por ahora no puedo mostrarte como escribir la letra: ${sound} .... "${type}"`;


    this.speechSynthesis.speak(msg);

  }


  startExample = () => {

    this.limpiar();
    this.addRepetitionData();
    this.setValues();

    const type  = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const sound = JSON.parse(localStorage.getItem('letter_sounds'))[this.letter.toLowerCase()];
    const msg   = `Mira atentamente, así se escribe la letra: ${sound} .... "${type}"`;

    this.speechSynthesis.speak(msg);
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

    obj.forEach(el => {
      tiempos.push(time);
      time += this.velocity;
    });

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
    console.log(el.clientWidth);
    if  (el.clientWidth < el.clientHeight) {

      return {
        width:  `${el.clientWidth * .90}px`,
        height: `${el.clientWidth * .90}px`
      };

    } else {

      return {
        width:  `${el.clientHeight * .90}px`,
        height: `${el.clientHeight * .90}px`
      };

    }
  }

  initUserData = () => {

    const t = this.genDates.generateData();

    this.userData['startTime'] = t.fullTime;
    this.userData['repetition'] = [];
    this.userData['nextTime'] = 'N/A';

  }

  addRepetitionData = () => {
    const t = this.genDates.generateData();
    this.userData['repetition'].push(t.fullTime);
  }

  addnextTime = () => {
    const t = this.genDates.generateData();
    this.userData['nextTime'] = t.fullTime;
  }

}
