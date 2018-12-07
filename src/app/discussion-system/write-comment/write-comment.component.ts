import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-write-comment',
  templateUrl: './write-comment.component.html',
  styleUrls: ['./write-comment.component.css']
})
export class WriteCommentComponent implements OnInit {

  @Input()  currentUser:    User;
  @Output() evsWriteComments = new EventEmitter<string>();

  commented: boolean;

  constructor() { }

  ngOnInit() { }

  reqAddComment = (el: HTMLTextAreaElement) => {

    // const text = escape(el.value.trim());
    const text = el.value.trim();

    if (text.length > 0 && this.currentUser._id) {
      this.evsWriteComments.emit(text);
    }

    el.value = '';

  }

}
