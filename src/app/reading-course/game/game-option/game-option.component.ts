import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game-option',
  templateUrl: './game-option.component.html',
  styleUrls: ['./game-option.component.css']
})
export class GameOptionComponent implements OnInit {

  @Input() id: string;
  @Input() destroy: boolean;
  @Input() onSelect: Function;
  @Input() hide: boolean;
  @Input() highlight: boolean;
  @Input() desktop: boolean;

  constructor() { }

  ngOnInit() {
  }

}
