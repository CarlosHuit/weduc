import { Component, OnInit, Input } from '@angular/core';
import { ItemLetterMenu } from 'src/app/models/reading-course/item-letter-menu.model';
import { Store, Select } from '@ngxs/store';
import {
  SetInitialDataMenu,
  ListenWordAndLetter,
  ListenSpecificLetterMenu,
  ListenSoundLetterMenu,
  ActiveRedirection,
} from 'src/app/store/actions/reading-course/reading-course-menu.actions';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-letter-menu',
  templateUrl: './card-letter-menu.component.html',
  styleUrls: ['./card-letter-menu.component.css']
})
export class CardLetterMenuComponent implements OnInit {

  @Input() data: ItemLetterMenu;
  @Input() canSpeech: boolean;

  @Select(ReadingCourseState.highlightLetter)   highlightLetter$:   Observable<{letter: string, type: string}>;
  @Select(ReadingCourseState.selectedLetter)    selectedLetter$:    Observable<string>;

  constructor( public store: Store ) {

    this.store.dispatch( new SetInitialDataMenu() );
  }
  ngOnInit() {
  }

  listenWord (letter: string, word: string) {
    return this.canSpeech
            ? this.store.dispatch(new ListenWordAndLetter({letter, word}))
            : null;
  }

  listenLetter (letter: string) {
    return this.canSpeech
            ? this.store.dispatch( new ListenSpecificLetterMenu({letter}) )
            : null;
  }

  listenSoundLetter (letter: string) {
    return this.canSpeech
            ? this.store.dispatch(new ListenSoundLetterMenu({letter}))
            : null;
  }


  redirect = (letter: string) => {
    return this.canSpeech
      ? this.store.dispatch( new ActiveRedirection({ letter }))
      : null;
  }

}
