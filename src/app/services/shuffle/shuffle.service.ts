import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShuffleService {

  constructor() { }

  shuffle = (arr: string[], letter: string, amount) => {

    const array = arr;

    for (let i = 0; i < amount; i++) {
      array.push(letter);
    }

    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex   = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue      = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex]  = temporaryValue;

    }

    return array;
  }

  mess = (arr: string[]) => {

    const array = arr;
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex   = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue      = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex]  = temporaryValue;

    }

    return array;
  }

}
