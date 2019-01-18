import { ReadingCourseMenu } from './menu/reading-course-menu.model';
import { ReadingCourseDataModel } from './data/reading-course-data.model';
import { ReadingCourseLetterDetail } from './letter-detail/reading-course-letter-detail.model';

export class ReadingCourseModel {
  constructor(
    public data:         ReadingCourseDataModel,
    public menu:         ReadingCourseMenu,
    public letterDetail: ReadingCourseLetterDetail
  ) {}
}





