import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weduc';
  constructor (
    private _auth: AuthService
  ) {
  }

  isLoggedIn = () => {
    return this._auth.isLoggedIn();
  }
}
