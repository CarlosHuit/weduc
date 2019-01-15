import { Component  } from '@angular/core';
import { Store      } from '@ngxs/store';
import { AddComment } from 'src/app/store/actions/discussion-system.actions';

@Component({
  selector: 'app-write-comment',
  templateUrl: './write-comment.component.html',
  styleUrls: ['./write-comment.component.css']
})
export class WriteCommentComponent {


  commented: boolean;

  constructor(private store: Store) { }


  reqAddComment = (el: HTMLTextAreaElement) => {

    const text = el.value.trim();

    if (text.length > 0) {

      this.commented = false;
      this.store.dispatch(new AddComment({ text }));

    }

    el.value = '';

  }



}
