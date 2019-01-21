import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-guide-lines',
  templateUrl: './guide-lines.component.html',
  styleUrls: ['./guide-lines.component.css']
})
export class GuideLinesComponent implements OnInit {

  @Input() top: number;

  constructor() { }

  ngOnInit() {
  }

}
