import { Component, Input } from '@angular/core';
import { AddAnswer } from 'src/app/store/actions/discussion-system.actions';
import { Store } from '@ngxs/store';


@Component({
  selector: 'app-write-answer',
  templateUrl: './write-answer.component.html',
  styleUrls: ['./write-answer.component.css']
})
export class WriteAnswerComponent {

  @Input()  commentId:    string;
  commented: boolean;

  constructor(private store: Store) { }

  reqAddComment = (el: HTMLTextAreaElement) => {

    const text = el.value.trim();

    if (text.length > 0 ) {
      this.addAnswer(text, this.commentId);
    }

    el.value = '';

  }

  addAnswer = (text: string, commentId: string) => {
    this.store.dispatch(new AddAnswer({text, commentId}));
  }

}
