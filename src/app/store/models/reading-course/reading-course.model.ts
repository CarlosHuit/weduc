import { ReadingCourseMenu } from './menu/reading-course-menu.model';
import { ReadingCourseDataModel } from './data/reading-course-data.model';
import { ReadingCourseLetterDetail } from './letter-detail/reading-course-letter-detail.model';
import { ReadingCourseGameStateModel } from './game/reading-course-game.model';
import { ReadingCourseDrawLetterModel } from './draw-letter/reading-course-draw-letter.model';
import { ReadingCourseFindLetterModel } from './find-letter/reading-course-find-letter.model';
import { ReadingCourseSelectWordsModel } from './select-words/reading-course-select-words.model';

export class ReadingCourseModel {
  constructor(
    public data:         ReadingCourseDataModel,
    public menu:         ReadingCourseMenu,
    public letterDetail: ReadingCourseLetterDetail,
    public game:         ReadingCourseGameStateModel,
    public drawLetter:   ReadingCourseDrawLetterModel,
    public findLetter:   ReadingCourseFindLetterModel,
    public selectWords:  ReadingCourseSelectWordsModel
  ) {}
}





