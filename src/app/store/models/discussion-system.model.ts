import { Comment } from 'src/app/models/discussion-system/comment.model';

export class DiscussionSystemStateModel {
  constructor(
    public comments:             Comment[],
    public isLoadingComments:    boolean,
    public answersTemporaryIds:  string[],
    public commentsTemporaryIds: string[],
    public showAnswersOf:        {},
    public writeAnswerFor:       string,
    public answersToDelete:      {},
    public commentsToDelete:     {},
  ) {}
}
