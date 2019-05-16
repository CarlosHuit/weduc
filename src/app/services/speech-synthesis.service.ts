import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class SpeechSynthesisService {


  utterance: SpeechSynthesisUtterance;


  speak(text: string, velocity?: number): SpeechSynthesisUtterance {

    this.cancel();

    this.utterance        = new SpeechSynthesisUtterance();
    this.utterance.text   = text;
    this.utterance.lang   = 'es-US';
    this.utterance.volume =  0.4;
    this.utterance.rate   = velocity ? velocity : 1;
    this.utterance.pitch  = 1;

    window.speechSynthesis.speak(this.utterance);
    window.addEventListener('beforeunload', this.cancel, false);

    return this.utterance;

  }



  speakEs = (text: string): SpeechSynthesisUtterance => {

    this.cancel();

    this.utterance        = new SpeechSynthesisUtterance();
    this.utterance.text   = text;
    this.utterance.lang   = 'es-ES';
    this.utterance.volume = 0.4;
    this.utterance.rate   = 1;
    this.utterance.pitch  = 1;

    window.speechSynthesis.speak(this.utterance);
    window.addEventListener('beforeunload', this.cancel);

    this.utterance.addEventListener('end', () => window.removeEventListener('beforeunload', this.cancel) );

    return this.utterance;
  }



  /// Pause tts
  pause = () => {

    this.utterance = new SpeechSynthesisUtterance();
    window.speechSynthesis.pause();

  }



  /// Se reanuda tts pausado
  reanudar = () => {

    const state = window.speechSynthesis.paused;

    if (state === true) {
      window.speechSynthesis.resume();
    } else {
      console.log('No hay audios en la cola de reproduccion');
    }

  }



  /// Se Cancela la sintesis de voz en reproduccion
  cancel = () => {

    window.speechSynthesis.pause();
    window.speechSynthesis.cancel();

  }


}
