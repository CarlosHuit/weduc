import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GetCoordinatesService  } from '../../../services/get-data/get-coordinates.service';
import { SpeechSynthesisService } from '../../../services/speech-synthesis.service';
import { ActivatedRoute         } from '@angular/router';
import { GenerateDatesService   } from '../../../services/generate-dates.service';
import { Board, SizeCanvas      } from '../../../classes/draw-letter-data';
import { Coordinates            } from '../../../classes/coordinates';
import { Store, Select } from '@ngxs/store';
import { AppState } from 'src/app/store/state/app.state';
import { Observable } from 'rxjs';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { Preferences } from 'src/app/store/models/reading-course/draw-letter/reading-course-draw-letter.model';

@Component(
  {
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
  }
)

export class BoardComponent implements OnDestroy, AfterViewInit, OnInit {

  @Input() letter: string;

  @ViewChild('canvasEl')        canvasEl:        ElementRef;
  @ViewChild('containerCanvas') containerCanvas: ElementRef;

  @Output() evsBoard       = new EventEmitter<string>();
  @Output() next           = new EventEmitter<string>();
  @Input()  showGuidLines: boolean;

  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  contCanvas: HTMLDivElement;

  smoothing:     number;
  cw:            number;
  ch:            number;
  dibujar:       boolean;
  success:       boolean;
  inUse:         boolean;
  showDraw:      boolean;
  styleLine:     string;
  currentLetter: string;
  letterParam:   string;
  traces:        any[];
  points:        any[];

  coordinates:    Coordinates;
  userData:       Board;
  loading       = true;
  letterSounds: any;

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  @Select(AppState.queryMobileMatch) queryMobileMatch$: Observable<boolean>;
  @Select(ReadingCourseState.dlPreferences) preferences$: Observable<Preferences>;
  isMobile: boolean;
  queryMobileMatch: boolean;
  preferences: Preferences;

  constructor(
    private _route:            ActivatedRoute,
    private speechSynthesis:   SpeechSynthesisService,
    private coordinateService: GetCoordinatesService,
    private genDates:          GenerateDatesService,
    private store: Store,
  ) {
    this.success = false;
    this.letterParam = this._route.snapshot.paramMap.get('letter');
    this.store.selectSnapshot(state => this.letterSounds = state.readingCourse.data.letterSounds );
  }

  ngAfterViewInit() {
    this.canvas = this.canvasEl.nativeElement as HTMLCanvasElement;
    this.ctx    = this.canvas.getContext('2d');

    if (this.isMobile || this.queryMobileMatch) {

      this.contCanvas = this.containerCanvas.nativeElement;
      this.cw     = this.canvas.width   = this.contCanvas.clientWidth;
      this.ch     = this.canvas.height  = this.contCanvas.clientHeight;

    }


    if (!this.isMobile && !this.queryMobileMatch) {

      this.cw = this.canvas.width  = 600;
      this.ch = this.canvas.height = 300;

    }


    this.dibujar   = false;
    this.traces    = [];
    this.points    = [];
    this.smoothing = 5; // 5
    this.styleLine = 'round';


    this.startup(this.canvas);


    // window.addEventListener('resize', () => setTimeout(() => this.resetCanvasSize, 0) );
  }

  ngOnInit() {

    this.currentLetter = this.letterParam;
    this.isMobile$.subscribe(state => this.isMobile = state);
    window.addEventListener('resize', this.limpiar);
    this.queryMobileMatch$.subscribe(state => this.queryMobileMatch = state);
    this.preferences$.subscribe(p => this.preferences = p);
  }

  ngOnDestroy() {
    this.speechSynthesis.cancel();
    this.removeListeners(this.canvas);
    window.removeEventListener('resize', this.limpiar);
  }


  resetCanvasSize = () => {

    console.log(this.queryMobileMatch);
    if (this.isMobile || this.queryMobileMatch) {
      console.log('mobile');
      this.contCanvas = this.containerCanvas.nativeElement;
      this.cw         = this.canvas.width   = this.contCanvas.clientWidth;
      this.ch         = this.canvas.height  = this.contCanvas.clientHeight;
    }


    if (!this.isMobile && !this.queryMobileMatch ) {
      console.log('desktop');
      this.cw = this.canvas.width  = 600;
      this.ch = this.canvas.height = 300;
    }


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

  nextLetter = (): void => {

    this.addCoordinates(false);

    this.next.emit('next');

  }


  startup = (el): void => {

    const mobile = this.isMobile;

    if (mobile === true) {
      el.addEventListener('touchstart', this.handleStart, false);
      el.addEventListener('touchend',   this.handleEnd,   false);
      el.addEventListener('touchleave', this.handleEnd,   false);
      el.addEventListener('touchmove',  this.handleMove,  false);
    }

    if (mobile !== true) {
      el.addEventListener('mousedown', this.handleStart, false);
      el.addEventListener('mouseup',   this.handleEnd,   false);
      el.addEventListener('mouseout',  this.handleEnd,   false);
      el.addEventListener('mousemove', this.handleMove,  false);
    }

  }

  removeListeners = (el) => {
    const mobile = this.isMobile;

    if (mobile === true) {
      el.removeEventListener('touchstart', this.handleStart );
      el.removeEventListener('touchend',   this.handleEnd   );
      el.removeEventListener('touchleave', this.handleEnd   );
      el.removeEventListener('touchmove',  this.handleMove  );
    }

    if (mobile !== true) {
      el.removeEventListener('mousedown', this.handleStart );
      el.removeEventListener('mouseup',   this.handleEnd   );
      el.removeEventListener('mouseout',  this.handleEnd   );
      el.removeEventListener('mousemove', this.handleMove  );
    }
  }

  handleStart = (evt): void => {

    if (this.isMobile) { evt.preventDefault(); }

    this.dibujar = true;
    this.points.length = 0;
    this.ctx.beginPath();

  }


  onMousePosition = (canvas, ev): { x: any, y: any } => {

    const ClientRect = canvas.getBoundingClientRect();
    const mobile = this.isMobile;

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

      this.ctx.lineWidth   = this.preferences.lineWidth;
      this.ctx.strokeStyle = this.preferences.lineColor;
      this.ctx.lineCap     = this.styleLine as any;

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
    controlPoint.x     = (ry[a].x + ry[b].x) / 2;
    controlPoint.y     = (ry[a].y + ry[b].y) / 2;

    return controlPoint;

  }

  clearCanvas = () => {


    this.resetCanvasSize();
    this.addCoordinates(false);
    this.limpiar();
  }

  showModal = (): void => {
    this.evsBoard.emit('repeat');
    this.showDraw = false;
    this.resetCanvasSize();
    this.addCoordinates(true);
  }


  limpiar = (): void => {

    this.resetCanvasSize();
    this.dibujar = false;
    this.ctx.clearRect(0, 0, this.cw, this.ch);
    this.traces.length = 0;
    this.points.length = 0;

  }

  addCoordinates = (state: boolean) => {


    if ( this.traces.length > 0 ) {
      const t = this.genDates.generateData().fullTime;
      const d = JSON.parse( JSON.stringify(this.traces) );
      const x = new SizeCanvas(this.canvas.width, this.canvas.height);
      const s = new Board(d, x, t);

      const data = JSON.stringify({boardData: s, showHandwriting: state});
      this.evsBoard.emit(data);

    }

  }

}


