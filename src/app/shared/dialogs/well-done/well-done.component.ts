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

    setTimeout(this.speakWellDone, 600);

  }

  ngOnDestroy() {

    this.utterance.removeEventListener( 'end', this.activeAnimationHideDialog );

  }



  speakWellDone(): void {


    this.utterance = this.tts.speak('Bien Hecho', 0.90);
    this.utterance.addEventListener( 'end', this.activeAnimationHideDialog );

  }



  activeAnimationHideDialog(): void {

    this.activeHideDialog = true;
    setTimeout(this.hideWellDoneDialog, 600);

  }


  hideWellDoneDialog(): void {

    this.store.dispatch(new HideSuccessScreenLD());

  }


}
