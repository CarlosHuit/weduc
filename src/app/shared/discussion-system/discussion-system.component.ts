import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscussionSystemState } from '../../store/state/discussion-system.state';
import { Select, Store } from '@ngxs/store';
import { Observable    } from 'rxjs';
import { Comments      } from './models/comments';
import {
  GetComments,
  ShowAnswersOf,
  HideAnswersOf,
  WriteAnswerFor,
  ResetDiscussionSystem
} from '../../store/actions/discussion-system.actions';


@Component({
  selector: 'app-discussion-system',
  templateUrl: './discussion-system.component.html',
  styleUrls: ['./discussion-system.component.css']
})


export class DiscussionSystemComponent implements OnInit, OnDestroy {

  @Select(DiscussionSystemState.isLoadingComments)  loadingComments$:     Observable<boolean>;
  @Select(DiscussionSystemState.writeAnswerFor)   writeAnswerFor$:    Observable<string>;
  @Select(DiscussionSystemState.showAnswers)  showAnswers$:        Observable<{}>;
  @Select(DiscussionSystemState.comments)   comments$:        Observable<Comments[]>;

  constructor(private store: Store) { }

  ngOnInit() {

    this.store.dispatch(new GetComments());

  }


  ngOnDestroy() {

    this.store.dispatch(new ResetDiscussionSystem());

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
