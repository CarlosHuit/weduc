import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-loading',
  templateUrl: './spinner-loading.component.html',
  styleUrls: ['./spinner-loading.component.css']
})
export class SpinnerLoadingComponent implements OnInit {

  @Input() width: number;
  @Input() height: number;
  @Input() marginTop: number;

  constructor() { }

  ngOnInit() {
  }

}

