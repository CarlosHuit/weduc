import { Component, OnInit, Input } from '@angular/core';
import { User                     } from '../classes/user';
import { LocalStorageService      } from '../services/local-storage.service';
import { AuthService              } from '../services/auth.service';
import { Comments,                } from '../classes/comments';
import { DiscussionSystemService  } from '../services/discussion-system/discussion-system.service';
import { Answers, Answer          } from '../classes/answers';

import { MatDialog                    } from '@angular/material';
import { DeleteCommentDialogComponent } from './delete-comment-dialog/delete-comment-dialog.component';


@Component({
  selector:    'app-discussion-system',
  templateUrl: './discussion-system.component.html',
  styleUrls:   ['./discussion-system.component.css']
})


export class DiscussionSystemComponent implements OnInit {


  @Input() course_id: string;
  loadingComments:    boolean;
  comments:           Comments[];
  currentUser:        User;
  temporaryIds:       string[] = [];
  commented:          boolean;
  writeAnswer:        string;
  showAnswers         = {};

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

  openDialog = (id: string) => {

    const dialogRef = this.dialog.open( DeleteCommentDialogComponent, { disableClose: false });

    dialogRef.afterClosed()
      .subscribe(
        (ev) => ev === 'ok' ? this.deleteComment(id) : null
      );

  }

  openDialogAnswer = (answer_id: string, comment_id: string) => {

    const dialogRef = this.dialog.open( DeleteCommentDialogComponent, { disableClose: false });

    dialogRef.afterClosed()
      .subscribe( ev => this.deleteAnswer(answer_id, comment_id));

  }


  genUrl = (avatar: String) => `/assets/icon-user100X100/icon-${avatar}.png`;


  replaceId = (comment: Comments) => {

    const t_id  = comment.temp_id;
    const index = this.comments.findIndex(c => c.temp_id === t_id);

    const answersTemp_id = this.comments[index].answers_id.comment_id = comment._id;

    this.comments[index]._id = comment._id;
    delete(this.comments[index].temp_id);

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


  handleErr = (error: any) => { };


  sortByDate = (comments: Comments[]) => {

    const t = comments.sort((a, b) => {
      const x = new Date(a.date);
      const y = new Date(b.date);
      return x > y ? -1 : x < y ? 1 : 0;
    });

    return t;
  }


  deleteComment = (comment_id: string) => {


    const index   = this.comments.findIndex(comment => comment._id === comment_id);
    const valUser = this.comments[index].user_id['_id'] === this.currentUser._id;

    if (valUser) {

      const delEl = index > -1 ? this.comments.splice(index, 1) : null;

      this._discussionSystem.deleteComment(this.course_id, comment_id)
        .subscribe(
          val => { const x = val; },
          err => { const x = err; }
        );

    }

  }


  deleteAnswer = (answer_id: string, comment_id: string) => {

    const index = this.comments.findIndex(comment => comment._id === comment_id );
    const path  = this.comments[index];

    const iAnswer = path.answers_id.answers.findIndex(answer => answer._id === answer_id);
    path.answers_id.answers.splice(iAnswer, 1);

    this._discussionSystem.deleteAnswer(comment_id, answer_id)
      .subscribe(
        (val) => { const x = val; },
        (err) => { const x = err; }
      );
  }


  addComment = (text: string) => {

    const date  = new Date();

    if (text) {

      const newId      = this.generateTemporaryId(this.currentUser._id);
      const newAnswers = new Answers(newId, []);
      const newComment = new Comments(null,  this.currentUser._id, text, date, this.course_id, newId);
      const comment    = new Comments(null,  this.currentUser,     text, date, this.course_id, newId, newAnswers);

      this.comments.unshift(comment);

      this._discussionSystem.addComment(newComment)
        .subscribe(
          (val: Comments) => this.replaceId(val),
          (err)           => this.handleErr(err)
        );

    }

  }


  addAnswer = (text: string, comment_id: string) => {

    this.showAnswers[comment_id] = comment_id;

    const date    = new Date();
    const temp_id = this.generateTemporaryId(this.currentUser._id);

    const index   = this.comments.findIndex(comment => comment._id === comment_id);
    const path    = this.comments[index];

    const answerL = new Answer(this.currentUser,     text, date, comment_id, null, temp_id);
    const answer  = new Answer(this.currentUser._id, text, date, comment_id, null, temp_id);


    const addAnswer = path.answers_id ? path.answers_id.answers.push(answerL) : null;


    this._discussionSystem.addAnswer(answer)
      .subscribe(
        (val: Answer) => this.replaceIdAnswer(val),
        ( err: any  ) => this.handleErr(err)
      );

      this.writeAnswer = '';
  }

  replaceIdAnswer = (answer: Answer) => {

    const index = this.comments.findIndex(comment => comment._id === answer.comment_id );
    const path  = this.comments[index].answers_id.answers;

    const iAnswer = path.findIndex(_answer => _answer.temp_id === answer.temp_id );
    const el      = path[iAnswer]._id = answer._id;

    delete(path[iAnswer].temp_id);
  }

}
