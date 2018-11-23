import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlCanvas } from '../../classes/control-canvas';


@Component({
  selector: 'app-control-canvas',
  templateUrl: './control-canvas.component.html',
  styleUrls: ['./control-canvas.component.css']
})
export class ControlCanvasComponent implements OnInit {

  @Input()  colors:          string[];
  @Input()  lineWidth:       number;
  @Input()  lineColor:       string;
  @Input()  showGuidLines:   boolean;
  @Output() eventsNext       = new EventEmitter<boolean>();
  @Output() evsControlCanvas = new EventEmitter<ControlCanvas>();


  constructor() {

  }

  ngOnInit() {
    this.lineColor = '#007cc0';
    this.lineColor = this.colors[0];
  }


  changeColor = (color: string): void => {

    const x = new ControlCanvas(color, this.lineWidth, this.showGuidLines );
    this.evsControlCanvas.emit(x);

  }


  changeWidth = (value: number) => {
    const x = new ControlCanvas(this.lineColor, value, this.showGuidLines);
    this.evsControlCanvas.emit(x);
  }

  toggleGuideLines = () => {
    const x = new ControlCanvas(this.lineColor, this.lineWidth, !this.showGuidLines);
    this.evsControlCanvas.emit(x);
  }

  nextLetter = () => {
    this.eventsNext.emit(true);
  }

}
