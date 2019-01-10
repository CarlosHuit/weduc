import { State, Selector, StateContext, Action } from '@ngxs/store';
import { AppStateModel             } from '../models/app-state.model';
import { ChangeTitle, DetectMobile } from '../actions/app.actions';
import { DetectMobileService       } from '../../services/detect-mobile.service';


@State<AppStateModel>({
  name: 'app',
  defaults: {
    title:    'Weduc',
    isMobile: DetectMobileService.isMobile()
  }
})

export class AppState {

  @Selector()
  static getTitle({ title }: AppStateModel) {
    return title;
  }

  @Selector()
  static isMobile({ isMobile }: AppStateModel ) {
    return isMobile;
  }

  constructor(private _detectMobile: DetectMobileService ) { }

  @Action(ChangeTitle)
  changeTitle(context: StateContext<AppStateModel>, action: ChangeTitle) {
    const state = context.getState();
    context.patchState(
      {
        title: action.payload.title
      }
    );
  }

  @Action(DetectMobile)
  DetectMobile( { patchState }: StateContext<AppStateModel>, action: DetectMobile ) {
    patchState({
      isMobile: this._detectMobile.isMobile()
    });
  }


}

