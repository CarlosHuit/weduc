import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Comment } from 'src/app/models/discussion-system/comment.model';
import { CommentForm } from 'src/app/models/discussion-system/forms/comment-form.model';
import { DiscussionSystemService } from '../../shared/discussion-system/services/discussion-system.service';
import {
  AddAnswer,
  AddAnswerSuccess,
  AddAnswerToDelete,
  AddComment,
  AddCommentSuccess,
  AddCommentToDelete,
  DeleteAnswer,
  DeleteAnswerSuccess,
  DeleteComment,
  DeleteCommentSuccess,
  GetComments,
  GetCommentsSuccess,
  HideAnswersOf,
  IsLoadingComments,
  ResetDiscussionSystem,
  ShowAnswersOf,
  WriteAnswerFor,
} from '../actions/discussion-system.actions';
import { DiscussionSystemStateModel } from '../models/discussion-system.model';
import { AuthState } from './auth.state';
import { CoursesState } from './courses.state';
import { Answer } from 'src/app/models/discussion-system/answer.model';
import { AnswerForm } from 'src/app/models/discussion-system/forms/answer-form.model';

const initialData: DiscussionSystemStateModel = {
  comments: [],
  answersTemporaryIds: [],
  commentsTemporaryIds: [],
  showAnswersOf: {},
  answersToDelete: {},
  commentsToDelete: {},
  writeAnswerFor: '',
  isLoadingComments: false,
};

@State<DiscussionSystemStateModel>({
  name: 'comments',
  defaults: initialData,
})

export class DiscussionSystemState {

  static initialData = () => ({
    comments: [],
    answersTemporaryIds: [],
    commentsTemporaryIds: [],
    showAnswersOf: {},
    answersToDelete: {},
    commentsToDelete: {},
    writeAnswerFor: '',
    isLoadingComments: false,
  })


  @Selector()
  static isLoadingComments({ isLoadingComments }: DiscussionSystemStateModel) { return isLoadingComments; }


  @Selector()
  static commentsToDelete({ commentsToDelete }: DiscussionSystemStateModel) { return commentsToDelete; }


  @Selector()
  static answersToDelete({ answersToDelete }: DiscussionSystemStateModel) { return answersToDelete; }


  @Selector()
  static writeAnswerFor({ writeAnswerFor }: DiscussionSystemStateModel) { return writeAnswerFor; }


  @Selector()
  static showAnswers({ showAnswersOf }: DiscussionSystemStateModel) { return showAnswersOf; }


  @Selector()
  static comments({ comments }: DiscussionSystemStateModel) { return comments; }


  constructor(
    private store: Store,
    private _discussionSystem: DiscussionSystemService,
  ) { }


  /// ------ Comments Actions ------
  @Action(GetComments)
  getComments({ dispatch, getState }: StateContext<DiscussionSystemStateModel>, action: GetComments) {


    const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);


    if (isLoggedIn && !getState().isLoadingComments) {

      dispatch(new IsLoadingComments({ state: true }));
      const courseName = this.store.selectSnapshot(CoursesState.courseSubtitle);

      return this._discussionSystem.getCommentsCourse(courseName)
        .pipe(
          tap((comments: Comment[]) =>  dispatch(new GetCommentsSuccess(comments)) )
        );

    }


  }


  @Action(GetCommentsSuccess)
  getCommentsSuccess({ setState, dispatch, getState }: StateContext<DiscussionSystemStateModel>, { payload }: GetCommentsSuccess) {

    setState({

      ...getState(),
      comments: payload,
      isLoadingComments: false,
      answersTemporaryIds: [],
      commentsTemporaryIds: [],
      showAnswersOf: {},
      writeAnswerFor: ''
    });

    return dispatch(new IsLoadingComments({ state: false }));

  }


  @Action(AddComment)
  addComment({ getState, dispatch, patchState }: StateContext<DiscussionSystemStateModel>, { payload }: AddComment) {


    const text = payload.text;
    const user = this.store.selectSnapshot(AuthState.getUser);

    const createdAt = new Date();
    const course = this.store.selectSnapshot(CoursesState.course);
    const temporaryId = this.generateTemporaryId([...getState().commentsTemporaryIds], user.id);

    const commentToSend = new CommentForm(createdAt, text, user.id, temporaryId, course.id);
    const localComment = new Comment(null, createdAt, text, temporaryId, user, []);

    const comments = [localComment, ...getState().comments];
    const commentsTemporaryIds = [...getState().commentsTemporaryIds, temporaryId];

    patchState({
      comments,
      commentsTemporaryIds,
    });

    return this._discussionSystem.addComment(commentToSend, course).pipe(

      tap(comment => dispatch(new AddCommentSuccess(comment)))

    );


  }


  @Action(AddCommentSuccess)
  addCommentSuccess({ patchState, getState }: StateContext<DiscussionSystemStateModel>, { payload }: AddCommentSuccess) {

    const comments = getState().comments.map((comment => {

      if (comment.tempId === payload.tempId) {

        return new Comment(payload.id, comment.date, comment.text, null, comment.user, comment.answers);

      }

      return comment;

    }));


    patchState({ comments });


  }


  @Action(DeleteComment)
  deleteComment({ getState, dispatch }: StateContext<DiscussionSystemStateModel>, { payload }: DeleteComment) {


    const course = payload.course;
    const commentId = payload.comment_id;
    const user = this.store.selectSnapshot(AuthState.getUser);
    const comments = getState().comments;
    const comment = comments.find(c => c.id === commentId);
    const isUserOwner = comment.user.id === user.id;

    if (isUserOwner) {

      dispatch(new AddCommentToDelete({ commentId }));

      return this._discussionSystem.deleteComment(course, commentId).pipe(

        tap(res => dispatch(new DeleteCommentSuccess({ commentId })))

      );

    }


  }


  @Action(DeleteCommentSuccess)
  deleteCommentSuccess({ getState, patchState }: StateContext<DiscussionSystemStateModel>, { payload }: DeleteCommentSuccess) {

    return patchState({
      comments: getState().comments.filter(comment => comment.id !== payload.commentId)
    });

  }


  @Action(AddCommentToDelete)
  addCommentToDelete({ getState, patchState }: StateContext<DiscussionSystemStateModel>, { payload }: AddCommentToDelete) {

    const t = Object.assign({}, getState().commentsToDelete);
    t[payload.commentId] = payload.commentId;

    patchState({
      commentsToDelete: t
    });

  }


  @Action(IsLoadingComments)
  isLoadingComments({ patchState }: StateContext<DiscussionSystemStateModel>, { payload }: IsLoadingComments) {

    return patchState({
      isLoadingComments: payload.state,
    });

  }




  /// Answers actions
  @Action(AddAnswer)
  addAnswer({ patchState, getState, dispatch }: StateContext<DiscussionSystemStateModel>, { payload }: AddAnswer) {

    const state  = getState();
    const text   = payload.text;
    const date   = new Date();
    const user   = this.store.selectSnapshot(AuthState.getUser);
    const course = this.store.selectSnapshot(CoursesState.course);
    const tempId = this.generateTemporaryId([...state.answersTemporaryIds], user.id);
    const commentId = payload.commentId;


    const showAnswersOf       = Object.assign({}, state.showAnswersOf);
    showAnswersOf[commentId]  = commentId;
    const answersTemporaryIds = [ ...state.answersTemporaryIds, tempId, ];


    const localAnswer  = new Answer(null, date, tempId, text, user);
    const answerToSend = new AnswerForm(text, date, tempId, user.id, commentId);


    const comments = getState().comments.map(comment => {

      if (comment.id === commentId) {

        return new Comment(
          comment.id,
          comment.date,
          comment.text,
          null,
          comment.user,
          [...comment.answers, localAnswer],
        );

      }

      return comment;

    });


    patchState({
      comments,
      answersTemporaryIds,
      showAnswersOf,
    });


    return this._discussionSystem.addAnswer(answerToSend, course, commentId)
      .pipe(
        tap(answer => dispatch(new AddAnswerSuccess({ answer, commentId })))
      );

  }


  @Action(AddAnswerSuccess)
  addAnswerSuccess({ patchState, getState }: StateContext<DiscussionSystemStateModel>, { payload }: AddAnswerSuccess) {


    const state = getState();
    const tempId = payload.answer.tempId;
    const comments = state.comments.map( comment => {

      if ( comment.id === payload.commentId ) {

        const answers = comment.answers.map( answer => {

          if (answer.tempId === tempId) {
            return new Answer(payload.answer.id, answer.date, null, answer.text, answer.user);
          }

          return answer;

        });

        return new Comment( comment.id, comment.date, comment.text, null, comment.user, answers );

      }

      return comment;

    });


    patchState({ comments });


  }


  @Action(ShowAnswersOf)
  showAnswersOf({ patchState, getState }: StateContext<DiscussionSystemStateModel>, { payload }: ShowAnswersOf) {

    const t = Object.assign({}, getState().showAnswersOf, {});
    t[payload.commentId] = payload.commentId;

    patchState({
      showAnswersOf: t
    });
  }


  @Action(HideAnswersOf)
  hideAnswersOf({ getState, patchState }: StateContext<DiscussionSystemStateModel>, { payload }: HideAnswersOf) {

    const state = Object.assign({}, getState().showAnswersOf);
    delete state[payload.commentId];

    patchState({
      showAnswersOf: state
    });

  }


  @Action(WriteAnswerFor)
  writeAnswerFor({ patchState }: StateContext<DiscussionSystemStateModel>, { payload }: WriteAnswerFor) {
    patchState({
      writeAnswerFor: payload.commentId
    });
  }


  @Action(DeleteAnswer)
  deleteAnswer({ getState, dispatch }: StateContext<DiscussionSystemStateModel>, { payload }: DeleteAnswer) {

    dispatch(new AddAnswerToDelete({ answerId: payload.answerId }));

    let answersUpdated;
    const comments = [...getState().comments];
    const course = this.store.selectSnapshot(CoursesState.course);
    const iComment = comments.findIndex(comment => comment.id === payload.commentId);

    if (iComment > -1) {
      answersUpdated = comments[iComment].answers.filter(answer => answer.id !== payload.answerId);
    }

    return this._discussionSystem.deleteAnswer(
      course,
      payload.commentId,
      payload.answerId,
    ).pipe(
      tap(res => {

        dispatch(new DeleteAnswerSuccess({ commentId: payload.commentId, answersUpdated }));

      })
    );

  }


  @Action(DeleteAnswerSuccess)
  deleteAnswerSuccess({ patchState, getState }: StateContext<DiscussionSystemStateModel>, { payload }: DeleteAnswerSuccess) {

    patchState({
      comments: getState().comments.map(comment => {


        if (comment.id === payload.commentId) {

          return new Comment(
            comment.id,
            comment.date,
            comment.text,
            null,
            comment.user,
            payload.answersUpdated,
          );

        }

        return comment;

      })
    });

  }


  @Action(AddAnswerToDelete)
  addAnswerToDelete({ patchState, getState }: StateContext<DiscussionSystemStateModel>, { payload }: AddAnswerToDelete) {

    const t = Object.assign({}, getState().answersToDelete);
    t[payload.answerId] = payload.answerId;

    patchState({
      answersToDelete: t
    });

  }


  @Action(ResetDiscussionSystem)
  resetDiscussionSystem({ setState }: StateContext<DiscussionSystemStateModel>, action: ResetDiscussionSystem) {
    setState(initialData);
  }


  generateTemporaryId = (arrTmpIds: string[], comment_id: string) => {

    let number: number;

    if (arrTmpIds.length === 0) {

      number = 10;

    }

    if (arrTmpIds.length > 0) {

      const lastEl = arrTmpIds[arrTmpIds.length - 1];
      const lastIndex = parseInt(lastEl.slice(-2), 10);

      number = lastIndex + 1;

    }

    const temporary_id = `temp${comment_id}${number}`;
    arrTmpIds.push(temporary_id);

    return temporary_id;

  }


}
