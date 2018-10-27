import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerateIdsService {

  constructor() { }

  generateIDs = (array: string[]) => {
    const data = array;

    for (let i = 0; i < data.length; i++) {
      const element = `${data[i]}${i}`;
      data[i] = element;
    }
    return JSON.parse(JSON.stringify(data));
  }

}
