import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { AuthState } from 'src/app/store/state/auth.state';
import { Comment } from '../../../models/discussion-system/comment.model';
import { DeleteComment } from '../../../store/actions/discussion-system.actions';
import { CoursesState } from '../../../store/state/courses.state';
import { DiscussionSystemState } from '../../../store/state/discussion-system.state';
import { DeleteCommentDialogComponent } from '../delete-comment-dialog/delete-comment-dialog.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() data:          Comment;
  @Input() answers:       number;

  @Select(DiscussionSystemState.commentsToDelete)  commentsToDelete$: Observable<{}>;
  @Select(CoursesState.courseId) courseId$:   Observable<string>;
  @Select(AuthState.userId)        userId$:   Observable<string>;

  course: Course;

  constructor(
    private dialog: MatDialog,
    private store: Store,
  ) { }


  ngOnInit() {
    this.course = this.store.selectSnapshot(CoursesState.course);
  }


  genUrl(avatar: String) {

    return `/assets/icon-user100X100/icon-${avatar}.png`;

  }


  evOpenDialog = (comment_id: string) => {

    const dialog = this.dialog.open(DeleteCommentDialogComponent, { disableClose: false });
    dialog.afterClosed().subscribe(ev => ev === 'ok' ? this.deleteComment(comment_id) : null);

  }


  deleteComment = (comment_id: string) => {

    this.store.dispatch(new DeleteComment({ comment_id, course: this.course }));

  }


}
