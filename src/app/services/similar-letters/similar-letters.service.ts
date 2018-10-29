import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SimilarLettersService {

  constructor(private _storage: LocalStorageService) { }

  getDataFromStorage = (letter: string) => {

    const letterLC = letter.toLowerCase();
    const letterUC = letter.toUpperCase();

    try {

      const data = this._storage.getElement(`${letter.toLowerCase()}_sl`);

      const similarLowerCase = data[letterLC];
      const similarUpperCase = data[letterUC];

      const lowerCaseRandom = [];
      const upperCaseRandom = [];
      const amountLowerCase = this.randomInt(8, 12);
      const amountUpperCase = this.randomInt(8, 12);

      for (let i = 0; i < amountLowerCase; i++) { lowerCaseRandom.push(letterLC); }
      for (let i = 0; i < amountUpperCase; i++) { upperCaseRandom.push(letterUC); }


      for (let i = 0; i < 3; i++) {

        lowerCaseRandom.push(similarLowerCase[i]);
        upperCaseRandom.push(similarUpperCase[i]);

        similarLowerCase.forEach(ltr => lowerCaseRandom.push(ltr));
        similarUpperCase.forEach(ltr => upperCaseRandom.push(ltr));

      }


      const randomLowerCase = this.messUpWords(lowerCaseRandom);
      const randomUpperCase = this.messUpWords(upperCaseRandom);

      const upper = [];
      const lower = [];

      for (let i = 0; i < randomLowerCase.length; i++) {
        const element = `${randomLowerCase[i]}${i}`;
        lower.push(element);
      }

      for (let i = 0; i < randomUpperCase.length; i++) {
        const element = `${randomUpperCase[i]}${i}`;
        upper.push(element);
      }

      return { upperCase: upper,  lowerCase: lower };


    } catch (error) {
      console.log(error);
    }
  }

  messUpWords = (words) => {

    let messy = [];

    while (true) {

      if (!words.length) { break; }

      const extraction = words.shift();
      const random     = Math.floor(Math.random() * (messy.length + 1));
      const start      = messy.slice(0, random);
      const medium     = extraction;
      const end        = messy.slice(random, messy.length);

      messy = (start).concat(medium).concat(end);

    }

    return messy;

  }

  randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

}
