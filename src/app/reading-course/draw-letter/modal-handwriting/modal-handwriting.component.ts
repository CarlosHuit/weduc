import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';
import { ListenMsgBoardDL, HideHandwritingDL } from 'src/app/store/actions/reading-course/reading-course-draw-letter.actions';

@Component({
  selector: 'app-modal-handwriting',
  templateUrl: './modal-handwriting.component.html',
  styleUrls: ['./modal-handwriting.component.css']
})
export class ModalHandwritingComponent implements OnInit {

  activeStartAnimation = false;

  constructor( private store: Store, private _speech: SpeechSynthesisService ) { }

  ngOnInit() {
    this.showAnimation();
  }

  async showAnimation() {

    await new Promise((r, re) => setTimeout(() => r(null), 1) );
    this.activeStartAnimation = true;

  }

  async closeHandwriting(ev: MouseEvent) {

    const el = ev.target as HTMLElement;

    if (el.id === 'handWriting') {

      this.activeStartAnimation = false;

      await new Promise((r, re) => setTimeout(() => r(null), 650) );

      this._speech.cancel();
      this.store.dispatch( new ListenMsgBoardDL() );
      this.store.dispatch( new HideHandwritingDL() );


    }

  }


  async hideHandwriting() {

    this.activeStartAnimation = false;

    await new Promise((r, re) => setTimeout(() => r(null), 650) );

    this._speech.cancel();
    this.store.dispatch( new ListenMsgBoardDL() );
    this.store.dispatch( new HideHandwritingDL() );

  }



}
