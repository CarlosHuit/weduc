import { Comments } from '../../shared/discussion-system/models/comments';

export class DiscussionSystemStateModel {
  constructor(
    public comments:             Comments[],
    public isLoadingComments:    boolean,
    public answersTemporaryIds:  string[],
    public commentsTemporaryIds: string[],
    public showAnswersOf:        {},
    public writeAnswerFor:       string,
    public answersToDelete:      {},
    public commentsToDelete:     {},
  ) {}
}
