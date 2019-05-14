import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ReadingCourseState     } from 'src/app/store/state/reading-course.state';
import { ShowHandwritingDL, OnDoneDL      } from 'src/app/store/actions/reading-course/reading-course-draw-letter.actions';
import { Store, Select  } from '@ngxs/store';
import { AppState       } from 'src/app/store/state/app.state';
import { Observable     } from 'rxjs';
import { Preferences    } from 'src/app/store/models/reading-course/draw-letter/reading-course-draw-letter.model';
import { Coordinates } from 'src/app/classes/draw-letter-data';

export class StrokeData {
  constructor(
    public lineWidth?:   number,
    public lineColor?:   string,
    public coordinates?: Coordinates[],
  ) {}
}


@Component(
  {
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
  }
)

export class BoardComponent implements OnDestroy, AfterViewInit, OnInit {


  @ViewChild('canvasEl')        canvasEl:        ElementRef;
  @ViewChild('containerCanvas') containerCanvas: ElementRef;

  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  contCanvas: HTMLDivElement;

  cw:               number;
  ch:               number;
  canDraw:          boolean;
  isMobile:         boolean;
  smoothing:        number;
  preferences:      Preferences;
  queryMobileMatch: boolean;

  strokeData: StrokeData;
  strokes:    StrokeData[] = [];


  @Select(AppState.isMobile)                   isMobile$: Observable<boolean>;
  @Select(AppState.queryMobileMatch)   queryMobileMatch$: Observable<boolean>;
  @Select(ReadingCourseState.dlPreferences) preferences$: Observable<Preferences>;

  constructor(private store: Store) { }

  ngAfterViewInit() {

    this.canvas = this.canvasEl.nativeElement;
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


    this.canDraw   = false;
    this.smoothing = 2.5; // 5
    this.startup(this.canvas);
  }

  ngOnInit() {

    this.isMobile$.subscribe(state => this.isMobile = state);
    this.queryMobileMatch$.subscribe(state => this.queryMobileMatch = state);
    this.preferences$.subscribe(p => this.preferences = p);
    window.addEventListener('resize', this.clearCanvas);

  }


  ngOnDestroy() {

    this.removeListeners(this.canvas);
    window.removeEventListener('resize', this.clearCanvas);

  }

  done = () => {
    this.store.dispatch( new OnDoneDL() );
    this.clearCanvas();
  }

  deleteStokes = () => {
    this.clearCanvas();
  }

  showHandwriting = () => {
    this.store.dispatch( new ShowHandwritingDL() );
  }

  resetCanvasSize = () => {

    this.removeListeners(this.canvas);

    if (this.isMobile || this.queryMobileMatch) {
      this.contCanvas = this.containerCanvas.nativeElement;
      this.cw         = this.canvas.width   = this.contCanvas.clientWidth;
      this.ch         = this.canvas.height  = this.contCanvas.clientHeight;

    }


    if (!this.isMobile && !this.queryMobileMatch ) {

      this.cw = this.canvas.width  = 600;
      this.ch = this.canvas.height = 300;

    }

    this.startup(this.canvas);

  }

  startup = (el): void => {


    if (this.hasEvsTouch) {

      el.addEventListener('touchstart', this.handleStart, false);
      el.addEventListener('touchend',   this.handleEnd,   false);
      el.addEventListener('touchmove',  this.handleMove,  false);

    }

    if (this.hasEvsMouse) {

      el.addEventListener('mousedown', this.handleStart, false);
      el.addEventListener('mouseup',   this.handleEnd,   false);
      el.addEventListener('mouseout',  this.handleEnd,   false);
      el.addEventListener('mousemove', this.handleMove,  false);

    }

  }

  hasEvsTouch = (): boolean => {

    let hasEvsTouch = true;
    const evsTouch = ['ontouchstart', 'ontouchend', 'ontouchmove'];

    for (let i = 0; i < evsTouch.length; i++) {

      if ((evsTouch[i] in document.documentElement) === false) {
        hasEvsTouch = false;
        break;
      }

    }

    return hasEvsTouch;

  }

  hasEvsMouse = (): boolean => {

    let state = true;
    const evsTouch = ['mousedown', 'mouseup', 'mouseout', 'mousemove'];

    for (let i = 0; i < evsTouch.length; i++) {

      if ((evsTouch[i] in document.documentElement) === false) {
        state = false;
        break;
      }

    }

    return state;

  }


  removeListeners = (el) => {

    if (this.hasEvsTouch) {
      el.removeEventListener('touchstart', this.handleStart );
      el.removeEventListener('touchend',   this.handleEnd   );
      el.removeEventListener('touchleave', this.handleEnd   );
      el.removeEventListener('touchmove',  this.handleMove  );
    }

    if (this.hasEvsMouse) {
      el.removeEventListener('mousedown', this.handleStart );
      el.removeEventListener('mouseup',   this.handleEnd   );
      el.removeEventListener('mouseout',  this.handleEnd   );
      el.removeEventListener('mousemove', this.handleMove  );
    }

  }

  handleStart = (evt): void => {

    if (!this.isMobile) { evt.preventDefault(); }

    this.canDraw = true;
    this.strokeData = new StrokeData(this.preferences.lineWidth, this.preferences.lineColor, []);
    this.ctx.beginPath();

  }


  handleMove = (ev): void => {

    if (this.isMobile) { ev.preventDefault(); }

    if (this.canDraw) {

      const m = this.onMousePosition(this.canvas, ev);
      this.strokeData.coordinates.push(m);

      this.ctx.lineTo(m.x, m.y);

      this.ctx.lineWidth   = this.preferences.lineWidth;
      this.ctx.strokeStyle = this.preferences.lineColor;
      this.ctx.lineCap     = this.preferences.styleLine;

      this.ctx.stroke();
    }
  }


  handleEnd = (): void => {

    if (this.canDraw) {
      this.canDraw = false;
      this.ctx.clearRect(0, 0, this.cw, this.ch);

      const t = this.reducePoints(this.smoothing, this.strokeData.coordinates);
      const ts = new StrokeData( this.strokeData.lineWidth, this.strokeData.lineColor, t );
      this.strokes.push(ts);
      this.strokes.forEach(el => this.smoothStrokes(el));
    }

  }

  onMousePosition = (canvas, ev): { x: any, y: any } => {

    const ClientRect = canvas.getBoundingClientRect();
    const touches = ev.touches ? true : false;

    if (touches) {
      return {
        x: Math.round(ev.touches[0].clientX - ClientRect.left),
        y: Math.round(ev.touches[0].clientY - ClientRect.top)
      };
    }

    if (!touches) {
      return {
        x: Math.round(ev.clientX - ClientRect.left),
        y: Math.round(ev.clientY - ClientRect.top)
      };

    }
  }

  reducePoints = (smoothing, points): Coordinates[] => {

    const newPoints = [];
    newPoints[0] = points[0];

    for (let i = 0; i < points.length; i++) {
      const l = i % smoothing === 0 ? newPoints[newPoints.length] = points[i] : false;
    }

    newPoints[newPoints.length - 1] = points[points.length - 1];

    return newPoints;

  }


  smoothStrokes = (traces: StrokeData) => {

    const p = traces.coordinates;

    if (p.length > 1) {

      const lastPoint = p.length - 1;

      this.ctx.beginPath();
      this.ctx.moveTo(p[0].x, p[0].y);

      this.ctx.lineWidth   = traces.lineWidth;
      this.ctx.strokeStyle = traces.lineColor;

      for (let i = 1; i < p.length - 2; i++) {

        const pc = this.calcControlPoint(p, i, i + 1);
        this.ctx.quadraticCurveTo(p[i].x, p[i].y, pc.x, pc.y);

      }

      this.ctx.quadraticCurveTo(p[lastPoint - 1].x, p[lastPoint - 1].y, p[lastPoint].x, p[lastPoint].y);
      this.ctx.stroke();
    }

  }

  calcControlPoint = (ry, a, b): { x: number, y: number } => {

    const controlPoint = { x: 0, y: 0 };
    controlPoint.x     = (ry[a].x + ry[b].x) / 2;
    controlPoint.y     = (ry[a].y + ry[b].y) / 2;

    return controlPoint;

  }


  clearCanvas = () => {

    this.resetCanvasSize();
    this.canDraw = false;
    this.ctx.clearRect(0, 0, this.cw, this.ch);
    this.strokes = [];
    this.strokeData = null;

  }


}
