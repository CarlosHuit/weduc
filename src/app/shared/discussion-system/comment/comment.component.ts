import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Select, Store  } from '@ngxs/store';
import { MatDialog      } from '@angular/material';
import { Observable, Subscription     } from 'rxjs';
import { DiscussionSystemState        } from '../../../store/state/discussion-system.state';
import { DeleteComment                } from '../../../store/actions/discussion-system.actions';
import { CoursesState                 } from '../../../store/state/courses.state';
import { DeleteCommentDialogComponent } from '../delete-comment-dialog/delete-comment-dialog.component';
import { AuthState } from 'src/app/store/state/auth.state';
import { Comment } from '../../../models/discussion-system/comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  @Input() data:          Comment;
  @Input() answers:       number;

  @Select(DiscussionSystemState.commentsToDelete)  commentsToDelete$: Observable<{}>;
  @Select(CoursesState.courseId) courseId$:   Observable<string>;
  @Select(AuthState.userId)        userId$:   Observable<string>;

  courseIdSubscription: Subscription;
  course_id: string;

  constructor(private dialog: MatDialog, private store: Store) { }

  ngOnInit() {
    this.courseIdSubscription = this.courseId$.subscribe(_id => this.course_id = _id);
  }

  ngOnDestroy() {
    this.courseIdSubscription.unsubscribe();
  }

  genUrl = (avatar: String) => `/assets/icon-user100X100/icon-${avatar}.png`;


  evOpenDialog = (comment_id: string) => {

    const dialog = this.dialog.open(DeleteCommentDialogComponent, { disableClose: false });
    dialog.afterClosed().subscribe(ev => ev === 'ok' ? this.deleteComment(comment_id) : null);

  }

  deleteComment = (comment_id: string) => {

    this.store.dispatch(new DeleteComment({ comment_id, course_id: this.course_id }));

  }


}
