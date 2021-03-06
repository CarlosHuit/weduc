import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeleteCommentDialogComponent } from '../delete-comment-dialog/delete-comment-dialog.component';
import { Select, Store } from '@ngxs/store';
import { AuthState } from 'src/app/store/state/auth.state';
import { Observable } from 'rxjs';
import { DeleteAnswer } from 'src/app/store/actions/discussion-system.actions';
import { DiscussionSystemState } from 'src/app/store/state/discussion-system.state';
import { Answer } from 'src/app/models/discussion-system/answer.model';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent {

  @Input()  data:          Answer;
  @Input()  comment_id:   string;
  @Input()  indexAnswer:   number;

  @Select(AuthState.userId) userId$: Observable<string>;
  @Select(DiscussionSystemState.answersToDelete) answersToDelete$: Observable<{}>;

  constructor(private dialog: MatDialog, private store: Store) { }


  genUrl(avatar: String): string {

    return `/assets/icon-user100X100/icon-${avatar}.png`;

  }


  evOpenDialog(): void {

    const dialog = this.dialog.open(DeleteCommentDialogComponent, { disableClose: false });

    dialog.afterClosed().subscribe(ev => ev === 'ok' ? this.deleteAnswer() : null);

  }


  deleteAnswer(): void {

    this.store.dispatch(new DeleteAnswer({
      answerId:  this.data.id,
      commentId: this.comment_id,
      index:     this.indexAnswer
    }));

  }


}
