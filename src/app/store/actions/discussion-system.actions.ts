import { Comments } from 'src/app/shared/discussion-system/models/comments';
import { Answer, Answers } from 'src/app/shared/discussion-system/models/answers';

export enum DiscussionSystemActionsType {
  GET_COMMENTS           = '[Discussion System] get comments',
  GET_COMMENTS_SUCCESS   = '[Discussion System] get comments success',
  IS_LOADING_COMMENTS    = '[Discussion System] edit comment',

  ADD_COMMENT            = '[Discussion System] add comment',
  ADD_COMMENT_SUCCESS    = '[Discussion System] add comment success',
  ADD_COMMENT_ERROR      = '[Discussion System] add comment error',
  ADD_COMMENT_TO_DELETE  = '[Discussion System] add comment to delete',

  EDIT_COMMENT           = '[Discussion System] edit comment',
  EDIT_COMMENT_SUCCESS   = '[Discussion System] edit comment success',
  EDIT_COMMENT_ERROR     = '[Discussion System] edit comment error',

  DELETE_COMMENT         = '[Discussion System] delete comment',
  DELETE_COMMENT_SUCCESS = '[Discussion System] delete comment success',
  DELETE_COMMENT_ERROR   = '[Discussion System] delete comment error',

  ADD_ANSWER             = '[Discussion System] add answer',
  ADD_ANSWER_SUCCESS     = '[Discussion System] add answer success',
  ADD_ANSWER_ERROR       = '[Discussion System] add answer error',
  ADD_ANSWER_TO_DELETE   = '[Discussion System] add answer to delete',

  DELETE_ANSWER          = '[Discussion System] delete answer',
  DELETE_ANSWER_SUCCESS  = '[Discussion System] delete answer success',
  DELETE_ANSWER_ERROR    = '[Discussion System] delete answer success',

  EDIT_ANSWER            = '[Discussion System] edit answer',
  EDIT_ANSWER_SUCCESS    = '[Discussion System] edit answer success',
  EDIT_ANSWER_ERROR      = '[Discussion System] edit answer success',

  IS_LOADING_ANSWERS     = '[Discussion System] edit answer',
  SHOW_ANSWERS           = '[Discussion System] show answers',
  HIDE_ANSWERS           = '[Discussion System] hide answers',
  WRITE_ANSWER_FOR       = '[Discussion System] write answer for',

  RESET_DATA             = '[Discussion System] reset state'
}



/// actions get Comments
export class GetComments {

  static readonly type = DiscussionSystemActionsType.GET_COMMENTS;

}


export class GetCommentsSuccess {

  static readonly type = DiscussionSystemActionsType.GET_COMMENTS_SUCCESS;
  constructor(public payload: Comments[]) {}

}


export class IsLoadingComments {

  static readonly type = DiscussionSystemActionsType.IS_LOADING_COMMENTS;
  constructor(public payload: { state: boolean }) {}

}



/// Actions add comment
export class AddCommentToDelete {

  static readonly type = DiscussionSystemActionsType.ADD_COMMENT_TO_DELETE;
  constructor( public payload: { commentId: string } ) {}

}


export class AddComment {

  static readonly type = DiscussionSystemActionsType.ADD_COMMENT;
  constructor( public payload: { text: string } ) {}

}


export class AddCommentSuccess {

  static readonly type = DiscussionSystemActionsType.ADD_COMMENT_SUCCESS;
  constructor(public payload: Comments) {}

}


export class AddCommentError {

  static readonly type = DiscussionSystemActionsType.ADD_COMMENT_ERROR;

}



/// Actions delete comment
export class DeleteComment {

  static readonly type = DiscussionSystemActionsType.DELETE_COMMENT;
  constructor(public payload: { course_id: string, comment_id: string }) {}

}


export class DeleteCommentSuccess {

  static readonly type = DiscussionSystemActionsType.DELETE_COMMENT_SUCCESS;
  constructor(public payload: {comment_id: string}) {}


}

export class DeleteCommentError {

  static readonly type = DiscussionSystemActionsType.DELETE_COMMENT_ERROR;

}



/// Actions edit comment
export class EditComment {

  static readonly type = DiscussionSystemActionsType.EDIT_COMMENT;

}


export class EditCommentSuccess {

  static readonly type = DiscussionSystemActionsType.EDIT_COMMENT_SUCCESS;

}


export class EditCommentError {

  static readonly type = DiscussionSystemActionsType.EDIT_COMMENT_ERROR;

}



/// Actions Add answer
export class AddAnswer {

  static readonly type = DiscussionSystemActionsType.ADD_ANSWER;
  constructor( public payload: { text: string, comment_id: string }) {}

}


export class AddAnswerSuccess {

  static readonly type = DiscussionSystemActionsType.ADD_ANSWER_SUCCESS;
  constructor( public payload: {answer: Answer} ) {}

}


export class AddAnswerError {

  static readonly type = DiscussionSystemActionsType.ADD_ANSWER_ERROR;

}

export class AddAnswerToDelete {

  static readonly type = DiscussionSystemActionsType.ADD_ANSWER_TO_DELETE;
  constructor( public payload: {answerId: string} ) {}

}



/// Actions Delete answer
export class DeleteAnswer {

  static readonly type = DiscussionSystemActionsType.DELETE_ANSWER;
  constructor(public payload: { commentId: string, answerId: string, index: number }) {}

}


export class DeleteAnswerSuccess {

  static readonly type = DiscussionSystemActionsType.DELETE_ANSWER_SUCCESS;
  constructor(public payload: { commentId: string, answersUpdated: Answers[] }) {}

}


export class DeleteAnswerError {

  static readonly type = DiscussionSystemActionsType.DELETE_ANSWER_ERROR;

}



/// Actions Edit answer
export class EditAnswer {

  static readonly type = DiscussionSystemActionsType.EDIT_ANSWER;

}


export class EditAnswerSuccess {

  static readonly type = DiscussionSystemActionsType.EDIT_ANSWER_SUCCESS;

}


export class EditAnswerError {

  static readonly type = DiscussionSystemActionsType.EDIT_ANSWER_ERROR;

}



export class IsLoadingAnswer {

  static readonly type = DiscussionSystemActionsType.IS_LOADING_ANSWERS;

}


export class ShowAnswersOf {

  static readonly type = DiscussionSystemActionsType.SHOW_ANSWERS;
  constructor(public payload: { commentId: string }) {}

}


export class HideAnswersOf {

  static readonly type = DiscussionSystemActionsType.HIDE_ANSWERS;
  constructor(public payload: { commentId: string }) {}

}


export class WriteAnswerFor {

  static readonly type = DiscussionSystemActionsType.WRITE_ANSWER_FOR;
  constructor(public payload: { commentId: string }) {}

}


export class ResetDiscussionSystem {

  static readonly type = DiscussionSystemActionsType.RESET_DATA;

}
