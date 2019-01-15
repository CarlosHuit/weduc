import { AppState      } from './state/app.state';
import { DrawerState   } from './state/drawer.state';
import { AuthState     } from './state/auth.state';
import { CoursesState  } from './state/courses.state';
import { DiscussionSystemState } from './state/discussion-system.state';

export const rootState = [
  AppState,
  DrawerState,
  AuthState,
  CoursesState,
  DiscussionSystemState
];
