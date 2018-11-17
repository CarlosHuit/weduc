import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  getElement = (key: string) => {

    const data = localStorage.getItem(key);
    if (data === null || data === undefined) {

      return null;

    } else {

      return JSON.parse(data);

    }

  }

  saveElement = (key: string, content: any) => {
    localStorage.setItem(key, JSON.stringify(content));
  }

}
