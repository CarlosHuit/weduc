import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CoordinatesService, Coordinates } from '../../services/coordinates.service';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GenerateDatesService } from '../../services/generate-dates.service';
import { SoundService } from '../../services/sound.service';

interface BoardData {
  startTime?:   string;
  nextTime?:    string;
  letter?:      string;
  repeatTime?:  string;
  coordinates?: any[];
}

@Component(
  {
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
  }
)

export class BoardComponent implements OnDestroy, AfterViewInit, OnInit {

  @Input() letter: string;

  @ViewChild('canvasEl') canvasEl: ElementRef;
  @Output() showHandwriting = new EventEmitter<string>();
  @Output() next            = new EventEmitter<string>();

  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  smoothing: number;
  cw:        number;
  ch:        number;
  lineWidth: number;
  dibujar:   boolean;
  lineColor: string;
  styleLine: string;
  traces:    any[];
  points:    any[];

  currentLetter: string;
  success:       boolean;
  letterParam:   string;
  inUse:         boolean;
  showDraw:      boolean;
  loading =      true;
  coordinates:   Coordinates;
  userData:      BoardData = {};

  constructor(
    private router:            Router,
    private _route:            ActivatedRoute,
    private soundService:      SoundService,
    private speechSynthesis:   SpeechSynthesisService,
    private coordinateService: CoordinatesService,
    private genDates:          GenerateDatesService
  ) {
    this.success = false;
    this.letterParam = this._route.snapshot.paramMap.get('letter');
  }

  ngAfterViewInit() {
    this.canvas = this.canvasEl.nativeElement as HTMLCanvasElement;
    this.ctx    = this.canvas.getContext('2d');
    this.cw     = this.canvas.width = 300;
    this.ch     = this.canvas.height = 300;

    this.dibujar = false;
    this.traces = [];
    this.points = [];

    this.smoothing = 5; // 5
    this.lineWidth = 16;
    this.lineColor = '#1b64ac';
    this.styleLine = 'round';

    this.startup(this.canvas);
  }

  ngOnInit() {

    this.currentLetter = this.letterParam;


  }

  ngOnDestroy() {
    this.speechSynthesis.cancel();
  }


  showModal = (): void => {
    this.showDraw = false;
    this.addRepeatTime();
    this.addCoordinates();
    const data = JSON.stringify(this.userData);
    this.showHandwriting.emit(data);
  }


  save = (): void => {

    const letter = prompt('letra?');
    const data = { letter: letter, coordinates: this.traces };

    this.coordinateService.saveCoordinnates(data)
      .subscribe(
        val => console.log(`Save Ok:${val}`),
        err => console.log(err)
      );
  }


  playSound = (name: string, category: string): void => {
    this.soundService.playSound(name, category);
  }


  nextLetter = (): void => {

    this.addNextTime();
    this.addCoordinates();

    const data = JSON.stringify(this.userData);

    this.next.emit(data);

  }


  startup = (el): void => {

    const mobile = this.ismobile();

    if (mobile === true) {
      el.addEventListener('touchstart', this.handleStart, false);
      el.addEventListener('touchend', this.handleEnd, false);
      el.addEventListener('touchleave', this.handleEnd, false);
      el.addEventListener('touchmove', this.handleMove, false);
    }

    if (mobile !== true) {
      el.addEventListener('mousedown', this.handleStart, false);
      el.addEventListener('mouseup', this.handleEnd, false);
      el.addEventListener('mouseout', this.end, false);
      el.addEventListener('mousemove', this.handleMove, false);
    }

  }

  end = () => { };


  handleStart = (evt): void => {

    if (this.ismobile()) { evt.preventDefault(); }

    this.dibujar = true;
    this.points.length = 0;
    this.ctx.beginPath();

  }


  onMousePosition = (canvas, ev): { x: any, y: any } => {

    const ClientRect = canvas.getBoundingClientRect();
    const mobile = this.ismobile();

    if (mobile) {
      return {
        x: Math.round(ev.touches[0].clientX - ClientRect.left),
        y: Math.round(ev.touches[0].clientY - ClientRect.top)
      };
    }

    if (!mobile) {
      return {
        x: Math.round(ev.clientX - ClientRect.left),
        y: Math.round(ev.clientY - ClientRect.top)
      };

    }
  }


  handleMove = (ev): void => {

    if (this.dibujar) {

      const m = this.onMousePosition(this.canvas, ev);
      this.points.push(m);

      this.ctx.lineTo(m.x, m.y);

      this.ctx.lineWidth = this.lineWidth;
      this.ctx.strokeStyle = this.lineColor;
      this.ctx.lineCap = this.styleLine as any;

      this.ctx.stroke();
    }
  }


  handleEnd = (): void => {

    if (this.dibujar) {

      this.dibujar = false;
      this.ctx.clearRect(0, 0, this.cw, this.ch);
      this.reducePoints(this.smoothing, this.points);

      this.traces.forEach(el => this.smoothStrokes(el));
    }

  }


  reducePoints = (smoothing, points): void => {

    const newPoints = [];
    newPoints[0] = points[0];

    for (let i = 0; i < points.length; i++) {
      const l = i % smoothing === 0 ? newPoints[newPoints.length] = points[i] : false;
    }

    newPoints[newPoints.length - 1] = points[points.length - 1];

    const savePoints = newPoints[0] !== undefined ? this.saveTraces(newPoints) : false;

  }

  saveTraces = (newPoints) => {
    this.traces.push(newPoints);
  }


  smoothStrokes = (traces): void => {

    const p = traces;

    if (p.length > 1) {

      const ultimoPunto = p.length - 1;

      this.ctx.beginPath();
      this.ctx.moveTo(p[0].x, p[0].y);

      for (let i = 1; i < p.length - 2; i++) {

        const pc = this.calcControlPoint(p, i, i + 1);
        this.ctx.quadraticCurveTo(p[i].x, p[i].y, pc.x, pc.y);

      }

      this.ctx.quadraticCurveTo(p[ultimoPunto - 1].x, p[ultimoPunto - 1].y, p[ultimoPunto].x, p[ultimoPunto].y);
      this.ctx.stroke();
    }

  }


  calcControlPoint = (ry, a, b): { x: any, y: any } => {

    const controlPoint = { x: 0, y: 0 };
    controlPoint.x = (ry[a].x + ry[b].x) / 2;
    controlPoint.y = (ry[a].y + ry[b].y) / 2;

    return controlPoint;

  }


  limpiar = (): void => {



    this.addCoordinates();
    this.dibujar = false;
    this.ctx.clearRect(0, 0, this.cw, this.ch);
    this.traces.length = 0;
    this.points.length = 0;

  }


  ismobile = (): boolean => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  }

  initUserData = () => {
    const t = this.genDates.generateData();

    this.userData['startTime'] = t.fullTime;
    this.userData['nextTime'] = 'N/A';
    this.userData['repeatTime'] = 'N/A';
    this.userData['coordinates'] = [];

  }

  addNextTime = () => {
    const t = this.genDates.generateData();
    this.userData['nextTime'] = t.fullTime;
  }

  addRepeatTime = () => {
    const t = this.genDates.generateData();
    this.userData['repeatTime'] = t.fullTime;
  }

  addCoordinates = () => {


    if (this.traces.length > 0) {
      const d = JSON.parse(JSON.stringify(this.traces));
      this.userData['coordinates'].push(d);

    }

  }



}
