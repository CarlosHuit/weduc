import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Title } from '@angular/platform-browser';
import { Select, Store } from '@ngxs/store';
import { TitleState } from './store/state/title.state';
import { Observable } from 'rxjs';
import { ChangeTitle } from './store/actions/title.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'weduc';
  @Select(TitleState.getTitle) title$: Observable<string>;

  constructor (
    private _titleService: Title,
    private _auth:         AuthService,
    private store:         Store
  ) { }

  ngOnInit() {
    this.title$.subscribe(x => this._titleService.setTitle(x));
    setTimeout(() => this.changeTitle('hola mundo'), 3000);
    setTimeout(() => this.changeTitle('Hola otra vez'), 6000);
  }

  isLoggedIn = () => {
    return this._auth.isLoggedIn();
  }

  changeTitle = (title: string) => {
    this.store.dispatch( new ChangeTitle({title}));
  }


}
