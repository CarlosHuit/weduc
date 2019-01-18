import { ReadingCourseModel, ReadingCourseDataModel, ReadingCourseMenu } from '../models/reading-course/reading-course.model';
import {
  GetInitialData,
  GetInitialDataSuccess,
  IsLoadingDataOfReadingCourse,
  SortLearnedLettersByAlphabet,
  SortLearnedLettersByRating,
  ChangerSorter,
  ChangeActiveTab,
  SelectLetter,
  HighlightLetter,
  ActiveRedirection,
  ListenMessage,
} from '../actions/reading-course.actions';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { GetInitialDataService } from 'src/app/services/get-data/get-initial-data.service';
import { tap } from 'rxjs/operators';
import { Navigate } from '@ngxs/router-plugin';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';
import { InitialData } from 'src/app/classes/initial-data';

@State<ReadingCourseModel>({
  name: 'readingCourse',
})

export class ReadingCourseState {

  @Selector()
  static isLoadingData({ data }: ReadingCourseModel) {
    return data.isLoadingDataOfReadingCourse;
  }

  @Selector()
  static learnedLetters({ data }: ReadingCourseModel) {
    return data.learnedLetters;
  }

  @Selector()
  static lettersMenu({ data }: ReadingCourseModel) {
    return data.lettersMenu;
  }

  @Selector()
  static letterSounds({ data }: ReadingCourseModel) {
    return data.letterSounds;
  }

  @Selector()
  static hasLearnedLetters({ data }: ReadingCourseModel) {
    return data.learnedLetters.length > 0 ? true : false;
  }


  @Selector()
  static sortedBy({ menu }: ReadingCourseModel) { return menu.sortedBy; }

  @Selector()
  static activeTab({ menu }: ReadingCourseModel) { return menu.activeTab; }

  @Selector()
  static selectedLetter({ menu }: ReadingCourseModel) { return menu.selectedLetter; }

  @Selector()
  static highlightLetter({ menu }: ReadingCourseModel) { return menu.highlight; }

  @Selector()
  static canSpeech({ menu }: ReadingCourseModel) {
    const v1 = menu.highlight;
    const v2 = menu.selectedLetter;
    const val = ( (v1.letter === '' && v1.type === '') || (!v1.letter && !v1.type) )
                && (v2 === '' || !v2)
                && !menu.activeRedirection;
    return val ? true : false;
  }

  constructor(
    private _readingCourse: GetInitialDataService,
    private _speech: SpeechSynthesisService,
  ) { }

  /* ---------- data handler actions ---------- */

  @Action(GetInitialData)
  getInitialData({ dispatch, getState }: StateContext<ReadingCourseModel>, action: GetInitialData) {

    const hasData = getState().data ? true : false;

    if (hasData) {
      console.log('not request data');
      dispatch(new SortLearnedLettersByAlphabet);
      dispatch(new ChangeActiveTab({ tab: 'alphabet' }));
      dispatch(new IsLoadingDataOfReadingCourse({ state: false }));
      dispatch(new ListenMessage({ msg: 'Este es el abecedario. Selecciona una letra para continuar.' }));
    }

    if (!hasData) {

      console.log('request data');
      dispatch(new IsLoadingDataOfReadingCourse({ state: true }));

      return this._readingCourse.getInitialData().pipe(
        tap(data => dispatch(new GetInitialDataSuccess({ data })))
      );

    }


  }

  @Action(GetInitialDataSuccess)
  getInitialDataSuccess({ patchState, dispatch, getState }: StateContext<ReadingCourseModel>, { payload }: GetInitialDataSuccess) {

    const lLetters = payload.data.learnedLetters;
    const combinations = payload.data.letters.combinations;
    const alphabetList = [];

    payload.data.words.forEach(w => {

      if (lLetters.findIndex(s => s.letter === w.l) < 0) {

        const t = {
          'letter': w.l,
          'word': w.w[0],
          'imgUrl': `/assets/img100X100/${w.w[0]}-min.png`,
        };

        alphabetList.push(t);
      }

    });

    lLetters.forEach(l => l['combinations'] = combinations[l.letter]);

    const data: ReadingCourseDataModel = {
      lettersMenu: alphabetList,
      learnedLetters: lLetters,
      letterSounds: payload.data.letters.sound_letters,
    };

    patchState({
      data,
      menu: {
        ...getState().menu,
        highlight: {
          letter: '',
          type: ''
        },
        activeRedirection: false,
        selectedLetter: '',
        activeTab: 'alphabet',
        sortedBy: 'alphabet'
      }
    });
    dispatch(new SortLearnedLettersByAlphabet);
    dispatch(new ChangeActiveTab({ tab: 'alphabet' }));
    dispatch(new IsLoadingDataOfReadingCourse({ state: false }));
    dispatch(new ListenMessage({ msg: 'Este es el abecedario. Selecciona una letra para continuar.' }));

  }

  @Action(IsLoadingDataOfReadingCourse)
  IsLoadingDataOfReadingCourse(ctx: StateContext<ReadingCourseModel>, { payload }: IsLoadingDataOfReadingCourse) {

    ctx.patchState({
      data: {
        ...ctx.getState().data,
        isLoadingDataOfReadingCourse: payload.state
      }
    });

  }

  @Action(SortLearnedLettersByAlphabet)
  sortLearnedLettersByAlphabet(ctx: StateContext<ReadingCourseModel>, action: SortLearnedLettersByAlphabet) {

    const learnedLetters = [...ctx.getState().data.learnedLetters];
    learnedLetters.sort((a, b) => {

      if (a.letter > b.letter) { return 1; }
      if (a.letter < b.letter) { return -1; }
      return 0;
    });

    ctx.patchState({
      data: {
        ...ctx.getState().data,
        learnedLetters
      }
    });

    ctx.dispatch(new ChangerSorter({ sorter: 'alphabet' }));

  }

  @Action(SortLearnedLettersByRating)
  sortLearnedLettersByRating(ctx: StateContext<ReadingCourseModel>, action: SortLearnedLettersByRating) {


    const learnedLetters = [...ctx.getState().data.learnedLetters];
    learnedLetters.sort((a, b) => b.rating - a.rating);

    ctx.patchState({
      data: {
        ...ctx.getState().data,
        learnedLetters: learnedLetters
      }
    });

    ctx.dispatch(new ChangerSorter({ sorter: 'rating' }));
  }

  /* ---------- menu handler actions ---------- */

  @Action(ListenMessage)
  listenInstructions(ctx: StateContext<ReadingCourseModel>, { payload }: ListenMessage) {

    this._speech.speak(payload.msg);

  }

  @Action(ChangerSorter)
  changerSorter({ patchState, getState }: StateContext<ReadingCourseModel>, { payload }: ChangerSorter) {
    patchState({
      menu: {
        ...getState().menu,
        sortedBy: payload.sorter
      }
    });
  }

  @Action(ChangeActiveTab)
  changeActiveTab({ patchState, getState, dispatch }: StateContext<ReadingCourseModel>, { payload }: ChangeActiveTab) {


    patchState({
      menu: {
        ...getState().menu,
        activeTab: payload.tab
      }
    });

    if (payload.tab === 'alphabet') {

      const msg = 'Este es el abecedario. Selecciona una letra para continuar.';
      dispatch( new ListenMessage({msg}) );

    }

    if (payload.tab === 'learneds') {

      const hasLearnedLetters = getState().data.learnedLetters.length;
      const msg1 = 'Aquí aparecerán las letras que vayas aprendiendo';
      const msg2 = 'Estas son las letras que has aprendido';
      const msg = hasLearnedLetters === 0 ? msg1 : msg2;
      dispatch( new ListenMessage({msg}) );

    }

  }

  @Action(SelectLetter)
  selectLetter({ patchState, getState }: StateContext<ReadingCourseModel>, { payload }: SelectLetter) {

    patchState({
      menu: {
        ...getState().menu,
        selectedLetter: payload.letter,
      }
    });

  }

  @Action(HighlightLetter)
  highlightLetter({ patchState, getState }: StateContext<ReadingCourseModel>, { payload }: HighlightLetter) {

    patchState({
      menu: {
        ...getState().menu,
        selectedLetter: payload.letter,
        highlight: {
          letter: payload.letter,
          type: payload.type,
        },
      }
    });

  }

  @Action(ActiveRedirection)
  activeRedirection({ patchState, getState, dispatch }: StateContext<ReadingCourseModel>, { payload }: ActiveRedirection) {

    dispatch(new SelectLetter({ letter: payload.letter }));
    patchState({
      menu: {
        ...getState().menu,
        activeRedirection: true,
      }
    });


    const redirectionsucces = () => {
      dispatch(new Navigate([payload.url]));
      dispatch(new SelectLetter({ letter: '' }));
      patchState({
        menu: {
          ...getState().menu,
          activeRedirection: false
        }
      });

    };

    const speech = this._speech.speak(payload.msg);
    speech.addEventListener('end', () => {
      redirectionsucces();
      speech.removeEventListener('end', redirectionsucces);
    });

  }




}



/* sortAlpha = () => {

  this.addSortingCount('alphabet');

  this.sortRatingState = false;
  this.sortedState.alpha = true;
  this.sortedState.rating = false;

  if (!this.sortAlphaState) {

    this.learneds.sort((a, b) => {

      if (a.letter > b.letter) { return 1; }
      if (a.letter < b.letter) { return -1; }
      return 0;
    });

    this.sortAlphaState = !this.sortAlphaState;

  } else {

    this.learneds.sort((b, a) => {

      if (a.letter > b.letter) { return 1; }
      if (a.letter < b.letter) { return -1; }

      return 0;
    });

    this.sortAlphaState = !this.sortAlphaState;

  }
}
 */

/* sortRating = () => {

  this.addSortingCount('rating');

  this.sortAlphaState = false;
  this.sortedState.alpha = false;
  this.sortedState.rating = true;

  if (!this.sortRatingState) {

    this.learneds.sort((a, b) => b.rating - a.rating);
    this.sortRatingState = !this.sortRatingState;

  } else {

    this.learneds.sort((b, a) => b.rating - a.rating);
    this.sortRatingState = !this.sortRatingState;

  }
} */
