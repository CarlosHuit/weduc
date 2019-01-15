import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DiscussionSystemState } from 'src/app/store/state/discussion-system.state';
import { Select, Store } from '@ngxs/store';
import { CoursesState } from '../../store/state/courses.state';
import { Comments } from './models/comments';
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


  courseSubscription: Subscription;

  @Select(DiscussionSystemState.isLoadingComments)  loadingComments$:     Observable<boolean>;
  @Select(DiscussionSystemState.writeAnswerFor)   writeAnswerFor$:    Observable<string>;
  @Select(DiscussionSystemState.showAnswers)  showAnswers$:        Observable<{}>;
  @Select(DiscussionSystemState.comments)   comments$:        Observable<Comments[]>;
  @Select(CoursesState.courseId)          courseId$:      Observable<string>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.courseSubscription = this.courseId$.subscribe(
      _id => this.store.dispatch(new GetComments({ course_id: _id }))
    );

  }

  ngOnDestroy() {
    this.courseSubscription.unsubscribe();
    this.store.dispatch(new ResetDiscussionSystem());
  }

  showAnswersOf = (commentId: string) => this.store.dispatch(new ShowAnswersOf({ commentId }));
  hideAnswersOf = (commentId: string) => this.store.dispatch(new HideAnswersOf({ commentId }));
  writeAnswerFor = (commentId: string) => this.store.dispatch(new WriteAnswerFor({ commentId }));

}
