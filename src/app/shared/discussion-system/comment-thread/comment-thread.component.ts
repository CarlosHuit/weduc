import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../../../models/discussion-system/comment.model';
import { Select, Store } from '@ngxs/store';
import { DiscussionSystemState } from 'src/app/store/state/discussion-system.state';
import { Observable } from 'rxjs';
import { ShowAnswersOf, HideAnswersOf, WriteAnswerFor } from 'src/app/store/actions/discussion-system.actions';

@Component({
  selector: 'app-comment-thread',
  templateUrl: './comment-thread.component.html',
  styleUrls: ['./comment-thread.component.css']
})
export class CommentThreadComponent implements OnInit {

  @Input() comment: Comment;

  @Select(DiscussionSystemState.writeAnswerFor) writeAnswerFor$: Observable<string>;
  @Select(DiscussionSystemState.showAnswers) showAnswers$: Observable<{}>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  showAnswersOf(commentId: string) {

    this.store.dispatch( new ShowAnswersOf( { commentId }));

  }


  hideAnswersOf(commentId: string) {

    this.store.dispatch( new HideAnswersOf( { commentId }));

  }


  writeAnswerFor(commentId: string) {

    this.store.dispatch( new WriteAnswerFor({ commentId }));

  }

}
