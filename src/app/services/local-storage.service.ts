import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  getElement = (key: string) => {

    const data = localStorage.getItem(key);
    return JSON.parse(data);

  }

}
