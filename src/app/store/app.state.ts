import { AppState  } from './state/app.state';
import { DrawerState } from './state/drawer.state';
import { AuthState   } from './state/auth.state';
import { CoursesState } from './state/courses.state';

export const rootState = [ AppState, DrawerState, AuthState, CoursesState ];
