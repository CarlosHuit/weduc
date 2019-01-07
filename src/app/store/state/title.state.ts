import { State, Selector, StateContext, Action } from '@ngxs/store';
import { TitleStateModel  } from '../models/title-state.model';
import { ChangeTitle } from '../actions/title.actions';
import { tap } from 'rxjs/operators';

@State<TitleStateModel>({
  name: 'app',
  defaults: {
    title: 'WEDUC APP'
  }
})

export class TitleState {

  @Selector()
  static getTitle(state: TitleStateModel) { return state.title; }

  constructor() {}

  @Action(ChangeTitle)
  changeTitle(context: StateContext<TitleStateModel>, action: ChangeTitle) {
    const state = context.getState();
    context.patchState(
      {
        title: action.payload.title
      }
    );
  }

}

