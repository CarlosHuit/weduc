import { Injectable } from '@angular/core';
import { log } from 'util';
import { ReturnStatement } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

export class SoundService {

  currentUrlAudio: HTMLAudioElement;
  prueba = [];

  constructor() {
    this.currentUrlAudio = new Audio();
  }

  playSound = (name: string, category: string) => {

    const nameSound = name.toLowerCase();
    let urlSound = '';

    if (category === 'sl') { urlSound = `/assets/audio/sound-letters/${nameSound}.wav`; }
    if (category === 'nl') { urlSound = `/assets/audio/name-letters/${nameSound}.wav`; }
    if (category === 'm') { urlSound = `/assets/audio/messages/${nameSound}.wav`; }
    if (category === 's') { urlSound = `/assets/audio/sounds/${nameSound}.wav`; }
    if (category === 'w') { urlSound = `/assets/audio/words/${nameSound}.wav`; }


    this.currentUrlAudio.pause();
    this.currentUrlAudio = new Audio(urlSound);
    this.currentUrlAudio.play();

  }
  saveSound = (name: string, category: string) => {

    const nameSound = name.toLowerCase();
    let urlSound = '';

    if (category === 'sl') { urlSound = `/assets/audio/sound-letters/${nameSound}.wav`; }
    if (category === 'nl') { urlSound = `/assets/audio/name-letters/${nameSound}.wav`; }
    if (category === 'm') { urlSound = `/assets/audio/messages/${nameSound}.wav`; }
    if (category === 's') { urlSound = `/assets/audio/sounds/${nameSound}.wav`; }
    if (category === 'w') { urlSound = `/assets/audio/words/${nameSound}.wav`; }

    const sound = new Audio(urlSound);
    sound.load();
    return sound;
  }

  loadSound = (listOfSounds: {}) => {

    const x: {} = listOfSounds;
    const listAudio = {};

    for (const i in x) {
      if (x.hasOwnProperty(i)) {
        const sound = this.saveSound(i, x[i]);
        listAudio[i] = sound;
      }
    }

    return listAudio;
  }


}
