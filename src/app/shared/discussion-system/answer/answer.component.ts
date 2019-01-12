import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Comments } from '../../classes/comments';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {

  @Input()  data:          any;
  @Input()  idCurrentUser: string;
  @Output() evsComment =   new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  genUrl = (avatar: String) => `/assets/icon-user100X100/icon-${avatar}.png`;

  evOpenDialog = (comment_id: string) => {
    this.evsComment.emit(comment_id);
  }

}
