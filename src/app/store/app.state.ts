import { AppState  } from './state/app.state';
import { DrawerState } from './state/drawer.state';
import { AuthState   } from './state/auth.state';

export const rootState = [ AppState, DrawerState, AuthState ];
