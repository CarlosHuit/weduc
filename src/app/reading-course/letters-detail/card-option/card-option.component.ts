import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SelectLetterLD } from 'src/app/store/actions/reading-course/reading-course-letter-detail.actions';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';

@Component({
  selector: 'app-card-option',
  templateUrl: './card-option.component.html',
  styleUrls: ['./card-option.component.css']
})
export class CardOptionComponent implements OnInit {

  @Input() letter: string;
  @Input() id: string;
  @Input() useTextStroke: boolean;

  @Select(ReadingCourseState.ldsel1) sel1$: Observable<string>;
  @Select(ReadingCourseState.ldsel2) sel2$: Observable<string>;
  @Select(ReadingCourseState.ldCanPlayGame)  canPlayGame$: Observable<boolean>;
  @Select(ReadingCourseState.ldShowAllCards) showAllCard$: Observable<boolean>;

  canPlayGame: boolean;
  sub1: Subscription;

  constructor(private store: Store) {

  }

  ngOnInit() {
    this.sub1 = this.canPlayGame$.subscribe(state => this.canPlayGame = state);
  }

  onSelect = (letterId: string) => {
    return this.canPlayGame
      ? this.store.dispatch(new SelectLetterLD({ letterId }))
      : null;
  }

  calcFZ(el: HTMLElement) {

    return { 'font-size': `${el.clientWidth * .5}px` };

  }


}
