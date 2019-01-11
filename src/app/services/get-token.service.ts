import { Injectable } from '@angular/core';
import { AuthState  } from '../store/state/auth.state';
import { Observable } from 'rxjs';
import { Select     } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class GetTokenService {

  token: string;
  @Select(AuthState.getToken) email$: Observable<string>;

  constructor() {
    this.email$.subscribe( token => this.token = token );
  }

  getToken = () => `?token=${this.token}`;
  addToken = () => `Bearer${this.token}`;

}
