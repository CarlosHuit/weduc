import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetTokenService {

  constructor() { }

  getToken() {
    const token = localStorage.getItem('token');
    return `?token=${token}`;
  }

  addToken() {

    const token = localStorage.getItem('token');
    return `Bearer${token}`;

  }

}
