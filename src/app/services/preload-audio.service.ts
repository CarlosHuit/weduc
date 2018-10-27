import { Injectable } from '@angular/core';
import { SpeechSynthesisService } from './speech-synthesis.service';

@Injectable({
  providedIn: 'root'
})
export class PreloadAudioService {

  incorrect: HTMLAudioElement;

  constructor( private speech: SpeechSynthesisService ) { }


  loadAudio = () => {
    this.incorrect = new Audio('/assets/audio/sounds/incorrect.mp3');
    this.incorrect.oncanplaythrough = () =>  false;
    this.incorrect.volume = .4;
  }


  playAudio = () => {
    this.speech.cancel();
    this.incorrect.pause();
    this.incorrect.currentTime = 0;
    this.incorrect.play();
  }

}
