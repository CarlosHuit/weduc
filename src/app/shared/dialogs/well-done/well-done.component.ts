import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';
import { HideSuccessScreenLD } from 'src/app/store/actions/reading-course/reading-course-letter-detail.actions';

@Component({
  selector: 'app-well-done',
  templateUrl: './well-done.component.html',
  styleUrls: ['./well-done.component.css']
})
export class WellDoneComponent implements OnInit, OnDestroy {

  activeHideDialog = false;
  utterance: SpeechSynthesisUtterance;

  constructor(
    private store: Store,
    private tts: SpeechSynthesisService
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {

  }



  async speakWellDone() {

    await new Promise((r, re) => setTimeout(() => r(null), 1000) );
    this.utterance = this.tts.speak('Bien Hecho', 0.90);
    await new Promise((r, re) => setTimeout(() => r(null), 1500) );
    this.activeHideDialog = true;
    await new Promise((r, re) => setTimeout(() => r(null), 600) );
    this.store.dispatch( new HideSuccessScreenLD() );

  }



  activeAnimationHideDialog = () => {

    this.activeHideDialog = true;
    setTimeout(this.hideWellDoneDialog, 600);

  }


  hideWellDoneDialog(): void {

    this.store.dispatch(new HideSuccessScreenLD());

  }


}
