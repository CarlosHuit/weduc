import { State, Selector, StateContext, Action, NgxsOnInit, Store } from '@ngxs/store';
import { AppStateModel             } from '../models/app-state.model';
import { ChangeTitle, DetectMobile, ChangeStateMobileQuery } from '../actions/app.actions';
import { DetectMobileService       } from '../../services/detect-mobile.service';
import { MediaMatcher } from '@angular/cdk/layout';


@State<AppStateModel>({
  name: 'app',
  defaults: {
    title:            'Weduc',
    isMobile:         DetectMobileService.isMobile(),
    queryMobileMatch: null
  }
})

export class AppState implements NgxsOnInit {

  mobileQuery: MediaQueryList;

  @Selector()
  static getTitle({ title }: AppStateModel) {
    return title;
  }

  @Selector()
  static isMobile({ isMobile }: AppStateModel ) {
    return isMobile;
  }

  @Selector()
  static queryMobileMatch( { queryMobileMatch }: AppStateModel ) {
    return queryMobileMatch;
  }

  constructor( private _detectMobile: DetectMobileService, public media: MediaMatcher ) { }

  ngxsOnInit({ dispatch }: StateContext<AppStateModel>) {

    this.mobileQuery = this.media.matchMedia('(max-width: 640px)');
    this.mobileQuery.addEventListener('change', (ev: MediaQueryListEvent) => {
      dispatch( new ChangeStateMobileQuery({state: ev.matches}) );
    });

    dispatch( new ChangeStateMobileQuery({state: this.mobileQuery.matches}) );

  }

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

  @Action(ChangeStateMobileQuery)
  changeStateMobileQuery( { patchState }: StateContext<AppStateModel>, { payload }: ChangeStateMobileQuery ) {
    console.log('Mobile Query State: ', payload.state);
    patchState({
      queryMobileMatch: payload.state
    });
  }




}

