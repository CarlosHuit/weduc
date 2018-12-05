import { Component, OnInit, Input } from '@angular/core';
import { User                     } from '../classes/user';
import { LocalStorageService      } from '../services/local-storage.service';
import { AuthService              } from '../services/auth.service';
import { Comments                 } from '../classes/comments';
import { DiscussionSystemService  } from '../services/discussion-system/discussion-system.service';

import { MatDialog } from '@angular/material';
import { DeleteCommentDialogComponent } from './delete-comment-dialog/delete-comment-dialog.component';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-discussion-system',
  templateUrl: './discussion-system.component.html',
  styleUrls: ['./discussion-system.component.css']
})


export class DiscussionSystemComponent implements OnInit {


  @Input() course_id: string;
  loadingComments:    boolean;
  comments:           Comments[];
  currentUser:        User;
  temporaryIds:       string[] = [];
  commented:          boolean;

  constructor(

    private _discussionSystem: DiscussionSystemService,
    private _storage:          LocalStorageService,
    private _auth:             AuthService,
    private dialog: MatDialog

  ) {

    if (this._auth.isLoggedIn()) {

      const u = this._storage.getElement('user');
      this.currentUser = new User(u.email, null, null, u.firstName, u.lastName, u.avatar, u.userId);

    }

    this.loadingComments = true;

  }

  ngOnInit() {
    this._discussionSystem.getAllCommments(this.course_id)
      .subscribe(
        (comments: Comments[]) => {
          this.comments        = this.sortByDate(comments);
          this.loadingComments = false;
        },
        (error) => { const e = error; }
      );
  }

  openDialog(id: string) {

    const dialogRef = this.dialog.open( DeleteCommentDialogComponent, { disableClose: false });
    dialogRef.afterClosed().subscribe(ev => ev === 'ok' ? this.deleteComment(id) : null );

  }

  genUrl = (avatar: String) => `/assets/icon-user100X100/icon-${avatar}.png`;


  addComment = (el: HTMLTextAreaElement) => {

    const value = el.value.trim().toString();
    const date  = new Date();

    if (value) {

      const newId      = this.generateTemporaryId(this.currentUser._id);
      const newComment = new Comments(null,  this.currentUser._id, value, date, this.course_id, newId);
      const comment    = new Comments(null,  this.currentUser,     value, date, this.course_id, newId);

      this.comments.unshift(comment);

      this._discussionSystem.addComment(newComment)
        .subscribe(
          (val: Comments) => this.replaceId(val),
          (err)           => this.handleErr(err)
        );

      el.value = '';

    }

  }

  replaceId = (comment: Comments) => {

    const t_id = comment.temp_id;
    const i    = this.comments.findIndex(c => c.temp_id === t_id);

    this.comments[i]._id = comment._id;
    delete(this.comments[i].temp_id);

  }

  deleteComment = (comment_id: string) => {


    const index   = this.comments.findIndex(comment => comment._id === comment_id);
    const valUser = this.comments[index].user_id['_id'] === this.currentUser._id;

    if (valUser) {

      const delEl = index > -1 ? this.comments.splice(index, 1) : null;

      this._discussionSystem.deleteComment(this.course_id, comment_id)
        .subscribe(
          val => { const t = val; },
          err => { const e = err; }
        );

    }

  }

  generateTemporaryId = (id: string) => {

    let number: number;

    if ( this.temporaryIds.length === 0 ) {
      number  = 10;
    }

    if ( this.temporaryIds.length > 0 ) {

      const lastEl    = this.temporaryIds[ this.temporaryIds.length - 1 ];
      const lastIndex = parseInt( lastEl.slice(-2), 10 );

      number = lastIndex + 1;

    }

    const temporary_id = `temp${id}${number}`;
    this.temporaryIds.push(temporary_id);

    return temporary_id;

  }

  handleErr = (error: any) => {

  }

  sortByDate = (comments: Comments[]) => {

    const t = comments.sort((a, b) => {
      const x = new Date(a.date);
      const y = new Date(b.date);
      return x > y ? -1 : x < y ? 1 : 0;
    });

    return t;
  }

  onFocus = () => {
    console.log('hola');
  }

  onFocusOut = () => {
    console.log('bye');
  }

}
