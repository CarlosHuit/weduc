import { Injectable } from '@angular/core';

interface IWindow extends Window {
  SpeechSynthesisUtterance: any;
  SpeechSynthesis: any;
}

@Injectable({ providedIn: 'root' })

export class SpeechSynthesisService {

  utterance: any;
  arrayDates: string[];

  constructor() { }


  /* Sintesis de voz Google Espanol Estados Unidos */
  speak = (text: string, velocity?: number): SpeechSynthesisUtterance => {

    this.cancel();

    const { SpeechSynthesisUtterance }: IWindow = <IWindow>window;
    const { speechSynthesis }: IWindow = <IWindow>window;

    this.utterance        = new SpeechSynthesisUtterance();
    this.utterance.text   = text;
    this.utterance.lang   = 'es-US';
    this.utterance.volume =  0.4;
    this.utterance.rate   = velocity ? velocity : 1;
    this.utterance.pitch  = 1;

    (window as any).speechSynthesis.speak(this.utterance);
    (window as any).addEventListener('beforeunload', () => this.cancel(), false);

    // this.utterance.onend = () => {
    //   (window as any).removeEventListener('beforeunload', () => this.cancel(), false );
    // };

    return this.utterance;
  }

  speakEs = (text: string): SpeechSynthesisUtterance => {

    this.cancel();

    const { SpeechSynthesisUtterance }: IWindow = <IWindow>window;
    const { speechSynthesis }: IWindow = <IWindow>window;

    this.utterance        = new SpeechSynthesisUtterance();
    this.utterance.text   = text;
    this.utterance.lang   = 'es-ES';
    this.utterance.volume = 0.4;
    this.utterance.rate   = 1;
    this.utterance.pitch  = 1;

    (window as any).speechSynthesis.speak(this.utterance);
    (window as any).addEventListener('beforeunload', this.cancel());

    this.utterance.addEventListener('end', () => {
      (window as any).removeEventListener('beforeunload', this.cancel());
    });

    return this.utterance;
  }


  /* Se pauda una sintesis de voz en reproduccion */
  pause = () => {

    const { SpeechSynthesisUtterance }: IWindow = <IWindow>window;
    const { speechSynthesis }: IWindow = <IWindow>window;

    this.utterance = new SpeechSynthesisUtterance();
    (window as any).speechSynthesis.pause();

  }


  /* Se reanuda una sinstesis de voz previamente pausada */
  reanudar = () => {

    const { speechSynthesis }: IWindow = <IWindow>window;
    const state = speechSynthesis.paused;

    if (state === true) {
      (window as any).speechSynthesis.resume();
    } else {
      console.log('No hay audios en la cola de reproduccion');
    }

  }


  /* Se Cancela la sintesis de voz en reproduccion */
  cancel = () => {

    const { speechSynthesis }: IWindow = <IWindow>window;
    (window as any).speechSynthesis.pause();
    (window as any).speechSynthesis.cancel();

  }


}
