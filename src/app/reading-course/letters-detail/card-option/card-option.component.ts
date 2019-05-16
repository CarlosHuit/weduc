import { Component, Input, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
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
  @Input() onSelect: Function;

  @Select(ReadingCourseState.ldsel1) sel1$: Observable<string>;
  @Select(ReadingCourseState.ldsel2) sel2$: Observable<string>;
  @Select(ReadingCourseState.ldShowAllCards) showAllCard$: Observable<boolean>;


  ngOnInit() {
    this.showAllCard$.subscribe(el => console.log(el));
  }


  calcFZ(el: HTMLElement) {

    return { 'font-size': `${el.clientWidth * .5}px` };

  }


}
