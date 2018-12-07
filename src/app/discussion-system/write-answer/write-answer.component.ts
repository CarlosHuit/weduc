import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/classes/user';


@Component({
  selector: 'app-write-answer',
  templateUrl: './write-answer.component.html',
  styleUrls: ['./write-answer.component.css']
})
export class WriteAnswerComponent implements OnInit {

  @Input()  currentUser:    User;
  @Output() evsWriteComments = new EventEmitter<string>();

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
