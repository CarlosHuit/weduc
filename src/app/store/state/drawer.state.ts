import { State, Selector, StateContext, Action } from '@ngxs/store';
import { DrawerStateModel } from '../models/drawer-state.model';
import { ChangeStateDrawer, CloseDrawer } from '../actions/drawer.actions';

@State<DrawerStateModel>({
  name: 'drawer',
  defaults: {
    opened: false,
    urlBackground: '/assets/background/background-drawer.jpg'
  }
})

export class DrawerState {

  @Selector()
  static opened(state: DrawerStateModel) { return state.opened; }

  @Selector()
  static urlBackground(state: DrawerStateModel) {
    return state.urlBackground;
  }

  constructor() {}

  @Action(ChangeStateDrawer)
  changeDrawerState(context: StateContext<DrawerStateModel>, action: ChangeStateDrawer) {
    const state = context.getState();
    context.patchState(
      {
        opened: action.payload.status
      }
    );
  }

  @Action(CloseDrawer)
  closeDrawer(context: StateContext<DrawerStateModel>, action: CloseDrawer) {
    context.patchState(
      {
        opened: false
      }
    );
  }

}

