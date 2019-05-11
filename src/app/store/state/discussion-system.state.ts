import { DiscussionSystemStateModel } from '../models/discussion-system.model';
import { DiscussionSystemService } from '../../shared/discussion-system/services/discussion-system.service';
import { tap } from 'rxjs/operators';
import {
  State,
  Action,
  StateContext,
  Selector,
  Store
} from '@ngxs/store';
import {
  GetComments,
  IsLoadingComments,
  AddComment,
  AddCommentSuccess,
  GetCommentsSuccess,
  DeleteComment,
  AddAnswer,
  AddAnswerSuccess,
  ShowAnswersOf,
  HideAnswersOf,
  WriteAnswerFor,
  DeleteAnswer,
  AddAnswerToDelete,
  AddCommentToDelete,
  DeleteAnswerSuccess,
  DeleteCommentSuccess,
  ResetDiscussionSystem
} from '../actions/discussion-system.actions';
import { Comments } from 'src/app/shared/discussion-system/models/comments';
import { AuthState } from './auth.state';
import { CoursesState } from './courses.state';
import { Answers, Answer } from 'src/app/shared/discussion-system/models/answers';

const initialData: DiscussionSystemStateModel = {
  comments:             [],
  answersTemporaryIds:  [],
  commentsTemporaryIds: [],
  showAnswersOf:        {},
  answersToDelete:      {},
  commentsToDelete:     {},
  writeAnswerFor:       '',
  isLoadingComments:    false,
};

@State<DiscussionSystemStateModel>({
  name: 'comments',
  defaults: initialData,
})

export class DiscussionSystemState {

  static initialData = () => ({
    comments:             [],
    answersTemporaryIds:  [],
    commentsTemporaryIds: [],
    showAnswersOf:        {},
    answersToDelete:      {},
    commentsToDelete:     {},
    writeAnswerFor:       '',
    isLoadingComments:    false,
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


  constructor(private _discussionSystem: DiscussionSystemService, private store: Store) { }


  /* ------ Comments Actions ------ */
  @Action(GetComments)
  getComments({ dispatch, getState }: StateContext<DiscussionSystemStateModel>, action: GetComments) {


    const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);


    if (isLoggedIn && !getState().isLoadingComments) {

      dispatch(new IsLoadingComments({ state: true }));
      const courseName = this.store.selectSnapshot(CoursesState.courseSubtitle);

      return this._discussionSystem.getCommentsCourse(courseName)
        .pipe(
          tap((comments: Comments[]) => {
            console.log(comments);
            dispatch(new GetCommentsSuccess(comments));

          })
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
  addComment({ setState, getState, dispatch }: StateContext<DiscussionSystemStateModel>, { payload }: AddComment) {

    const text = payload.text;
    const user = this.store.selectSnapshot(AuthState.getUser);
    const courseId = this.store.selectSnapshot(CoursesState.courseId);
    const date = new Date();

    const tmp_id = this.generateTemporaryId([...getState().commentsTemporaryIds], user.id);
    const newAnswers = new Answers(tmp_id, []);

    const commentToSend = new Comments(null, user.id, text, date, courseId, tmp_id);
    const localComment = new Comments(null, user, text, date, courseId, tmp_id, newAnswers);


    setState({
      ...getState(),
      comments: [
        localComment,
        ...getState().comments
      ],
      commentsTemporaryIds: [
        ...getState().commentsTemporaryIds,
        tmp_id
      ]
    });

    return this._discussionSystem.addComment(commentToSend).pipe(
      tap(comment => dispatch(new AddCommentSuccess(comment)))
    );

  }

  @Action(AddCommentSuccess)
  addCommentSuccess({ patchState, getState }: StateContext<DiscussionSystemStateModel>, { payload }: AddCommentSuccess) {


    patchState({
      comments: getState().comments.map((comment => {

        if (comment.temp_id === payload.temp_id) {

          const tt = Object.assign({}, comment, {
            _id: payload._id,
            answers_id: {
              comment_id: payload._id,
              _id: payload.answers_id,
              answers: []
            },
          });

          delete tt.temp_id;
          return tt;

        }

        return comment;

      }))
    });


  }

  @Action(DeleteComment)
  deleteComment({ getState, dispatch }: StateContext<DiscussionSystemStateModel>, { payload }: DeleteComment) {

    dispatch(new AddCommentToDelete({ commentId: payload.comment_id }));

    const comments = [...getState().comments];
    const user = this.store.selectSnapshot(AuthState.getUser);
    const courseId = this.store.selectSnapshot(CoursesState.courseId);
    const index = comments.findIndex(comment => comment.user_id['id'] === user.id);
    const isUserOwner = index > -1 ? true : false;

    if (isUserOwner) {

      return this._discussionSystem.deleteComment(courseId, payload.comment_id).pipe(
        tap(res => dispatch(new DeleteCommentSuccess({ comment_id: payload.comment_id })))
      );

    }

  }

  @Action(DeleteCommentSuccess)
  deleteCommentSuccess({ getState, patchState }: StateContext<DiscussionSystemStateModel>, { payload }: DeleteCommentSuccess) {

    return patchState({
      comments: getState().comments.filter(comment => comment._id !== payload.comment_id)
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




  /* ------ Answer Actions ------ */
  @Action(AddAnswer)
  addAnswer({ patchState, getState, dispatch }: StateContext<DiscussionSystemStateModel>, { payload }: AddAnswer) {

    const user = this.store.selectSnapshot(AuthState.getUser);
    const temp_id = this.generateTemporaryId([...getState().answersTemporaryIds], user.id);
    const comment_id = payload.comment_id;
    const text = payload.text;
    const date = new Date();

    const t = Object.assign({}, getState().showAnswersOf);
    t[comment_id] = comment_id;

    const localAnswer = new Answer(user, text, date, comment_id, null, temp_id);
    const answerToSend = new Answer(null, text, date, comment_id, null, temp_id, user.id);

    patchState({

      comments: getState().comments.map(comment => {


        if (comment._id === localAnswer.comment_id) {

          return Object.assign({}, comment, {
            answers_id: {
              '_id': comment.answers_id._id,
              comment_id: comment.answers_id.comment_id,
              answers: [
                ...comment.answers_id.answers,
                localAnswer
              ]
            }
          });

        }

        return comment;

      }),
      answersTemporaryIds: [
        ...getState().answersTemporaryIds,
        temp_id
      ],
      showAnswersOf: t
    });

    return this._discussionSystem.addAnswer(answerToSend).pipe(
      tap(answer => dispatch(new AddAnswerSuccess({ answer })))
    );

  }

  @Action(AddAnswerSuccess)
  addAnswerSuccess({ patchState, getState }: StateContext<DiscussionSystemStateModel>, { payload }: AddAnswerSuccess) {

    let answerUpdated: Answer[];
    const state = getState();
    const iComment = state.comments.findIndex(comment => comment._id === payload.answer.comment_id);

    if (iComment > -1) {
      answerUpdated = state.comments[iComment].answers_id.answers.map(answer => {


        if (answer.temp_id === payload.answer.temp_id) {

          const newAnswer = Object.assign({}, answer, { _id: payload.answer._id });
          delete newAnswer.temp_id;
          return newAnswer;

        }

        return answer;


      });

    }


    patchState({
      comments: getState().comments.map(comment => {

        if (comment._id === payload.answer.comment_id) {

          return Object.assign({}, comment, {
            answers_id: {
              comment_id: payload.answer.comment_id,
              answers: answerUpdated
            }

          });

        }
        return comment;

      })
    });

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
    const iComment = comments.findIndex(comment => comment._id === payload.commentId);

    if (iComment > -1) {
      answersUpdated = comments[iComment].answers_id.answers.filter(answer => answer._id !== payload.answerId);
    }

    return this._discussionSystem.deleteAnswer(payload.commentId, payload.answerId).pipe(
      tap(res => dispatch(new DeleteAnswerSuccess({ commentId: payload.commentId, answersUpdated })))
    );

  }

  @Action(DeleteAnswerSuccess)
  deleteAnswerSuccess({ patchState, getState }: StateContext<DiscussionSystemStateModel>, { payload }: DeleteAnswerSuccess) {

    patchState({
      comments: getState().comments.map(comment => {


        if (comment._id === payload.commentId) {

          return Object.assign({}, comment, {
            answers_id: { comment_id: comment._id, answers: payload.answersUpdated }
          });

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

  @Action( ResetDiscussionSystem )
  resetDiscussionSystem({ setState }: StateContext<DiscussionSystemStateModel>, action: ResetDiscussionSystem ) {
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
