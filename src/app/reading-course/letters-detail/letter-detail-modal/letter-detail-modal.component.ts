import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-letter-detail-modal',
  templateUrl: './letter-detail-modal.component.html',
  styleUrls: ['./letter-detail-modal.component.css']
})
export class LetterDetailModalComponent implements OnInit {

  @Input() useStartAnimation: boolean;
  @Input() letter: string;

  @Input() onStart: Function;
  @Input() onEnd: Function;
  @Input() useMobileVersion: boolean;

  activeHideAnimation = false;

  constructor() { }

  ngOnInit() {

    setTimeout(this.onStart, 750);

  }


  hideCard() {
    this.activeHideAnimation = true;
    setTimeout(this.onEnd, 600);
  }

}
