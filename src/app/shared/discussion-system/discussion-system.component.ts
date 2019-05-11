import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/models/discussion-system/comment.model';
import { GetComments, ResetDiscussionSystem } from '../../store/actions/discussion-system.actions';
import { DiscussionSystemState } from '../../store/state/discussion-system.state';


@Component({
  selector: 'app-discussion-system',
  templateUrl: './discussion-system.component.html',
  styleUrls: ['./discussion-system.component.css']
})


export class DiscussionSystemComponent implements OnInit, OnDestroy {


  @Select(DiscussionSystemState.isLoadingComments)  loadingComments$: Observable<boolean>;
  @Select(DiscussionSystemState.comments) comments$: Observable<Comment[]>;


  constructor(private store: Store) { }


  ngOnInit() {

    this.store.dispatch(new GetComments());

  }


  ngOnDestroy() {

    this.store.dispatch(new ResetDiscussionSystem());

  }


}
