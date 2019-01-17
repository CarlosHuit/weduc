import { AppState      } from './state/app.state';
import { DrawerState   } from './state/drawer.state';
import { AuthState     } from './state/auth.state';
import { CoursesState  } from './state/courses.state';
import { DiscussionSystemState } from './state/discussion-system.state';
import { ReadingCourseState } from './state/reading-course.state';

export const rootState = [
  AppState,
  DrawerState,
  AuthState,
  CoursesState,
  DiscussionSystemState,
  ReadingCourseState,
];
