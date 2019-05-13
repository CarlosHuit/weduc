import { ReadingCourseStateModel } from '../models/reading-course/reading-course.model';
import {
  GetInitialData,
  GetInitialDataSuccess,
  IsLoadingDataOfReadingCourse,
  SortLearnedLettersByAlphabet,
  SortLearnedLettersByRating,
  ResetReadingCourseData,
  UpdateLearnedLetters,
  UpdateLearnedLettersInStorage,
} from '../actions/reading-course/reading-course-data.actions';
import {
  ChangerSorter,
  ChangeActiveTab,
  SelectLetter,
  HighlightLetter,
  ActiveRedirection,
  ListenMessage,
  RedirectMenu,
  ResetDataMenu,
  SetInitialDataMenu,
  ListenSpecificLetterMenu,
  ListenSoundLetterMenu,
  ListenWordAndLetter,
} from '../actions/reading-course/reading-course-menu.actions';
import { State, Action, StateContext, Selector, createSelector, Store } from '@ngxs/store';
import { GetInitialDataService } from 'src/app/services/get-data/get-initial-data.service';
import { tap } from 'rxjs/operators';
import { Navigate } from '@ngxs/router-plugin';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';
import {
  SetInitialDataLD,
  IsSettingDataLD,
  ShowLetterCardLD,
  HideLetterCardLD,
  ShowAllCardsLD,
  HideAllCardsLD,
  SelectLetterLD,
  AddFirstSelectionLD,
  AddSecondSelectionLD,
  LettersAreSameLD,
  LettersAreNotSameLD,
  ValidateSelectionsLD,
  ShowSuccessScreenLD,
  HideSuccessScreenLD,
  SetCurrentData,
  ResetLetterDetailData
} from '../actions/reading-course/reading-course-letter-detail.actions';
import { ShuffleService } from 'src/app/services/shuffle/shuffle.service';
import { GenerateIdsService } from 'src/app/services/generate-ids/generate-ids.service';
import { SLData } from '../models/reading-course/letter-detail/reading-course-letter-detail.model';
import { PreloadAudioService } from 'src/app/services/preload-audio.service';
import {
  SetInitialDataG,
  IsSettingDataG,
  SetCurrentDataG,
  RestartDataG,
  SelectLetterG,
  RegisterLetterIdG,
  IncreaseCorrectsG,
  IncreaseIncorrectsG,
  ListenInitialMsgG,
  ShowCorrectLettersG,
  ShowSuccessScreenG,
  HideSuccessScreenG,
  ChangeCurrentDataG,
  ResetDataG,
  UseHelpG
} from '../actions/reading-course/reading-course-game.actions';
import { GData } from '../models/reading-course/game/reading-course-game.model';
import {
  SetInitialDataDL,
  IsSettingDataDL,
  SetCurrentDataDL,
  ChangeLineWidthDL,
  ChangeLineColorDL,
  ToggleGuideLinesDL,
  ShowHandwritingDL,
  HideHandwritingDL,
  ListenHandwritingMsgDL,
  ShowSuccessScreenDL,
  HideSuccessScreenDL,
  OnDoneDL,
  ResetDataDL,
  ListenMsgBoardDL,
} from '../actions/reading-course/reading-course-draw-letter.actions';
import { DrawLetterData, ConfigData, Preferences } from '../models/reading-course/draw-letter/reading-course-draw-letter.model';
import {
  SetInitialDataFL,
  IsSettingDataFL,
  SetCurrentDataFL,
  SelectLetterIdFL,
  ShowSuccessScreenFL,
  HideSuccessScreenFL,
  ChangeCurrentDataFL,
  ResetDataFL,
  ListenInstructionsFL,
  ListenWordFL,
  DisableAllFL,
  AddCorrectSelectionFL,
  AddWrongSelectionFL,
  RegisterSelectionFL
} from '../actions/reading-course/reading-course-find-letter.actions';
import { FLData } from '../models/reading-course/find-letter/reading-course-find-letter.model';
import {
  IsSettingDataSW,
  SetInitialDataSW,
  SetCurrentDataSW,
  RegisterSelectionSW,
  SelectWordSW,
  RegisterCorrectSelectionSW,
  RegisterWrongSelectionSW,
  ChangeCurrentDataSW,
  ShowSuccessScreenSW,
  HideSuccessScreenSW,
  ResetDataSW,
  ListenInstructionsSW
} from '../actions/reading-course/reading-course-select-words.actions';
import { SWData } from '../models/reading-course/select-words/reading-course-select-words.model';
import { UserProgressService } from 'src/app/services/user-progress/user-progress.service';
import {
  IsSettingDataPL,
  SetInitialDataPL,
  SetCurrentDataPL,
  ListenInstructionsPL,
  ListenHelpPL,
  ListenMsgWrongPL,
  StartRecordingPL,
  HandleRecognitionResultPL,
  HandleRecognitionErrorPL,
  HandleRecognitionCompletePL,
  ChangeStateRecordingPL,
  ListenMsgNoSpeechPL,
  IncreaseAttemptsPL,
  CorrectPronunciationPL,
  ShowSuccessScreenPL,
  HideSuccessScreenPL,
  ResetDataPL
} from '../actions/reading-course/reading-course-pronounce-letter';
import { PLData } from '../models/reading-course/pronounce-letter/reading-course-pronounce-letter.model';
import { SpeechRecognitionService } from 'src/app/services/speech-recognition.service';
import { CoursesState } from './courses.state';
import { AuthState } from './auth.state';
import { ItemLetterMenu } from 'src/app/models/reading-course/item-letter-menu.model';
import { LearnedLetter } from 'src/app/models/reading-course/learned-letter.model';
import { ReadingCourseDataModel } from '../models/reading-course/data/reading-course-data.model';

@State<ReadingCourseStateModel>({
  name: 'readingCourse',
  defaults: {
    data:            null,
    menu:            null,
    game:            null,
    drawLetter:      null,
    letterDetail:    null,
    findLetter:      null,
    selectWords:     null,
    pronounceLetter: null
  }
})

export class ReadingCourseState {


  /* ---------- Selectors reading course data ---------- */
  @Selector()
  static hasData(state: ReadingCourseStateModel) {
    return state.data ? true : false;
  }

  @Selector()
  static isLoadingData({ data }: ReadingCourseStateModel) {
    return data.isLoadingData;
  }

  @Selector()
  static learnedLetters({ data }: ReadingCourseStateModel) {
    return data.learnedLetters;
  }

  @Selector()
  static lettersMenu({ data }: ReadingCourseStateModel) {
    return data.lettersMenu;
  }

  @Selector()
  static letterSounds({ data }: ReadingCourseStateModel) {
    return data.letterSounds;
  }

  @Selector()
  static hasLearnedLetters({ data }: ReadingCourseStateModel) {
    return data.learnedLetters.length > 0 ? true : false;
  }

  @Selector()
  static currentLetter({ data }: ReadingCourseStateModel) {
    return data.currentLetter;
  }



  /* ---------- Selectors reading course menu ---------- */
  @Selector()
  static sortedBy({ menu }: ReadingCourseStateModel) { return menu.sortedBy; }

  @Selector()
  static activeTab({ menu }: ReadingCourseStateModel) { return menu.activeTab; }

  @Selector()
  static selectedLetter({ menu }: ReadingCourseStateModel) { return menu.selectedLetter; }

  @Selector()
  static highlightLetter({ menu }: ReadingCourseStateModel) {
    return menu.highlight;
  }

  @Selector()
  static canSpeech({ menu }: ReadingCourseStateModel) {
    const v1 = menu.highlight;
    const v2 = menu.selectedLetter;
    const val = (v1 === '' || !v1)
      && (v2 === '' || !v2)
      && !menu.activeRedirection;
    return val ? true : false;
  }


  static pandas(letter: string) {
    return createSelector([ReadingCourseState], (state: ReadingCourseStateModel) => {
      return state.data.lettersMenu.filter(x => x.letter === letter);
    });
  }



  /*---------- selectors reading course letter-detail ----------*/
  @Selector()
  static ldCurrentData({ letterDetail }: ReadingCourseStateModel) { return letterDetail.currentData; }

  @Selector()
  static ldIsSettingData({ letterDetail }: ReadingCourseStateModel) { return letterDetail.isSettingData; }

  @Selector()
  static ldShowLetterCard({ letterDetail }: ReadingCourseStateModel) { return letterDetail.showLetterCard; }

  @Selector()
  static ldShowAllCards({ letterDetail }: ReadingCourseStateModel) { return letterDetail.showAllCards; }

  @Selector()
  static ldsel1({ letterDetail }: ReadingCourseStateModel) { return letterDetail.selections.selection1; }

  @Selector()
  static ldsel2({ letterDetail }: ReadingCourseStateModel) { return letterDetail.selections.selection2; }

  @Selector()
  static ldCanPlayGame({ letterDetail }: ReadingCourseStateModel) { return letterDetail.canPlayGame; }

  @Selector()
  static ldshowSuccessScreen({ letterDetail }: ReadingCourseStateModel) { return letterDetail.showSuccessScreen; }


  /*---------- selectors reading course game ----------*/
  @Selector()
  static gIsSettingData({ game }: ReadingCourseStateModel) { return game.isSettingData; }

  @Selector()
  static gCurrentData({ game }: ReadingCourseStateModel) { return game.currentData; }

  @Selector()
  static gCurrentLetter({ game }: ReadingCourseStateModel) { return game.currentData.letter; }

  @Selector()
  static gData({ game }: ReadingCourseStateModel) { return game.currentData.data; }

  @Selector()
  static gSelections({ game }: ReadingCourseStateModel) { return game.selections; }

  @Selector()
  static gProgress({ game }: ReadingCourseStateModel) {

    const t = game.currentData.totalCorrects;
    const p = game.currentData.correctsValidation;
    const x = 100 - ((p * 100) / t);
    return x;
  }

  @Selector()
  static gShowCorrectLetters({ game }: ReadingCourseStateModel) { return game.showCorrectLetters; }

  @Selector()
  static gShowSuccessScreen({ game }: ReadingCourseStateModel) { return game.showSuccessScreen; }



  /* ---------- Selectors Draw Letter ---------- */
  @Selector()
  static dlCurrentData({ drawLetter }: ReadingCourseStateModel) { return drawLetter.currentData; }

  @Selector()
  static dlConfigData({ drawLetter }: ReadingCourseStateModel) { return drawLetter.configData; }

  @Selector()
  static dlPreferences({ drawLetter }: ReadingCourseStateModel) { return drawLetter.preferences; }

  @Selector()
  static dlIsSettingData({ drawLetter }: ReadingCourseStateModel) { return drawLetter.isSettingData; }

  @Selector()
  static dlShowHandwriting({ drawLetter }: ReadingCourseStateModel) { return drawLetter.showHandwriting; }

  @Selector()
  static dlShowSuccessScreen({ drawLetter }: ReadingCourseStateModel) { return drawLetter.showSuccessScreen; }



  /* ---------- Selectors FindLetter ---------- */
  @Selector()
  static flIsSettingData({ findLetter }: ReadingCourseStateModel) { return findLetter.isSettingData; }

  @Selector()
  static flCurrentData({ findLetter }: ReadingCourseStateModel) { return findLetter.currentData; }

  @Selector()
  static flLettersQuantity({ findLetter }: ReadingCourseStateModel) { return findLetter.currentData.word.length; }

  @Selector()
  static flShowSuccessScreen({ findLetter }: ReadingCourseStateModel) { return findLetter.showSuccessScreen; }

  @Selector()
  static flAdvance({ findLetter }: ReadingCourseStateModel) {

    const total = 100;
    const totalOfCorrects = findLetter.totalOfCorrects;
    const totalOfPendings = findLetter.totalOfPendings;
    const result = total - ((totalOfPendings  * total) / totalOfCorrects);

    return result;

  }

  @Selector()
  static flDisableAll({ findLetter }: ReadingCourseStateModel) { return findLetter.disableAll; }
  @Selector()

  static flSelections({ findLetter }: ReadingCourseStateModel) { return findLetter.currentData.selections; }

  @Selector()
  static flCorrectSelections({ findLetter }: ReadingCourseStateModel) { return findLetter.currentData.correctSelections; }

  @Selector()
  static flWrongSelections({ findLetter }: ReadingCourseStateModel) { return findLetter.currentData.wrongSelections; }




  /* ---------- Selectors SelectWords Component ---------- */
  @Selector()
  static swIsSettingData({ selectWords }: ReadingCourseStateModel ) { return selectWords.isSettingData; }

  @Selector()
  static swWords({ selectWords }: ReadingCourseStateModel ) { return selectWords.currentData.words; }

  @Selector()
  static swSelections({ selectWords }: ReadingCourseStateModel ) { return selectWords.currentData.selections; }

  @Selector()
  static swCorrectSels({ selectWords }: ReadingCourseStateModel ) { return selectWords.currentData.correctSelections; }

  @Selector()
  static swWrongSels({ selectWords }: ReadingCourseStateModel ) { return selectWords.currentData.wrongSelections; }

  @Selector()
  static swShowSuccessScreen({ selectWords }: ReadingCourseStateModel ) { return selectWords.showSuccessScreen; }

  @Selector()
  static swAdvance({ selectWords }: ReadingCourseStateModel ) {

    const t = selectWords.currentData.totalOfCorrect;
    const p = selectWords.currentData.totalOfPending;
    const r = 100 - ((p * 100) / t);
    return r;
  }




  /* ---------- Selectors Pronounce Letter Component ---------- */
  @Selector()
  static plIsSettingData({ pronounceLetter }: ReadingCourseStateModel ) { return pronounceLetter.isSettingData; }

  @Selector()
  static plCurrentLetter({ pronounceLetter }: ReadingCourseStateModel ) { return pronounceLetter.currentData.letter; }

  @Selector()
  static plShowSuccessScreen({ pronounceLetter }: ReadingCourseStateModel ) { return pronounceLetter.showSuccessScreen; }

  @Selector()
  static plIsRecording({ pronounceLetter }: ReadingCourseStateModel ) { return pronounceLetter.isRecording; }

  @Selector()
  static plShowBtnHelp({ pronounceLetter }: ReadingCourseStateModel ) {
    return pronounceLetter.currentData.attempts > 0 ? true : false;
  }



  constructor(
    private _readingCourse: GetInitialDataService,
    private _shuffle:       ShuffleService,
    private _speech:        SpeechSynthesisService,
    private _audio:         PreloadAudioService,
    private _ids:           GenerateIdsService,
    private _progress:      UserProgressService,
    private store:          Store,
    private _recognition:   SpeechRecognitionService
  ) {
    this._audio.loadAudio();
  }





  /* ---------- data handler actions ---------- */
  @Action(GetInitialData)
  getInitialData({ dispatch, getState }: StateContext<ReadingCourseStateModel>, action: GetInitialData) {

    const hasData = getState().data ? true : false;

    if (hasData) {

      dispatch([
        new SortLearnedLettersByAlphabet(),
        new ChangeActiveTab({ tab: 'alphabet' }),
        new IsLoadingDataOfReadingCourse({ state: false }),
        new ListenMessage({ msg: 'Este es el abecedario. Selecciona una letra para continuar.' }),
      ]);

    }

    if (!hasData) {

      dispatch(new IsLoadingDataOfReadingCourse({ state: true }));

      const course = this.store.selectSnapshot(CoursesState.course);
      const user = this.store.selectSnapshot(AuthState.getUser);

      return this._readingCourse.getReadingCourseData(course, user.id)
      .pipe(
        tap(data => dispatch(new GetInitialDataSuccess({ data })))
      );

    }


  }


  @Action(GetInitialDataSuccess)
  getInitialDataSuccess({ patchState, dispatch, getState }: StateContext<ReadingCourseStateModel>, { payload }: GetInitialDataSuccess) {


    const data = payload.data;
    const learnedLetters = data.learnedLetters.map((el) => {

      return new LearnedLetter(
        el.letter,
        el.rating,
        data.letters.combinations[el.letter],
      );

    });

    const itemsLetterMenu = data.words.map( el => {

      const letterNoLearned = learnedLetters.findIndex(s => s.letter === el.letter) === -1;

      if (letterNoLearned) {

        return new ItemLetterMenu(
          el.letter.toLowerCase(),
          el.letter.toUpperCase(),
          el.letter,
          el.words[0],
          `/assets/img100X100/${el.words[0]}-min.png`,
        );

      }

    });

    const readingCourseData = new ReadingCourseDataModel(
      data.words,
      learnedLetters,
      true,
      itemsLetterMenu,
      data.letters.combinations,
      data.letters.letterSounds,
      data.similarLetters,
      data.coordinates,
      null,
      data.letters.alphabet,
      data.letters.vocals,
      data.letters.consonants,
    );

    patchState({
      data: readingCourseData,
      menu: {
        ...getState().menu,
        highlight: null,
        activeRedirection: false,
        selectedLetter: '',
        activeTab: 'alphabet',
        sortedBy: 'alphabet'
      }
    });

    dispatch([
      new SortLearnedLettersByAlphabet(),
      new ChangeActiveTab({ tab: 'alphabet' }),
      new IsLoadingDataOfReadingCourse({ state: false }),
      new ListenMessage({ msg: 'Este es el abecedario. Selecciona una letra para continuar.' })
    ]);


  }


  @Action(IsLoadingDataOfReadingCourse)
  IsLoadingDataOfReadingCourse(ctx: StateContext<ReadingCourseStateModel>, { payload }: IsLoadingDataOfReadingCourse) {

    ctx.patchState({
      data: {
        ...ctx.getState().data,
        isLoadingData: payload.state
      }
    });

  }


  @Action(SortLearnedLettersByAlphabet)
  sortLearnedLettersByAlphabet(ctx: StateContext<ReadingCourseStateModel>, action: SortLearnedLettersByAlphabet) {

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
  sortLearnedLettersByRating(ctx: StateContext<ReadingCourseStateModel>, action: SortLearnedLettersByRating) {


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


  @Action(ResetReadingCourseData)
  resetReadingCourseData( { patchState, getState }: StateContext<ReadingCourseStateModel>, action: ResetReadingCourseData ) {
    patchState({
      data: null,
      drawLetter: null,
      findLetter: null,
      game: null,
      letterDetail: null,
      menu: null,
      selectWords: null
    });
  }


  @Action( UpdateLearnedLetters )
  updateLearnedLetters({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: UpdateLearnedLetters) {

    const letter      = payload.letter;
    const rating      = payload.rating;
    const data        = getState().data;
    const index       = data.learnedLetters.findIndex(e => e.letter === letter );
    const existLetter = index > -1 ? true : false;

    if ( existLetter ) {

      const newRatingIsGreater = rating > data.learnedLetters[index].rating;

      if (newRatingIsGreater) {

        const learnedLetters = data.learnedLetters.map(e => {

          if ( e.letter === letter ) {
            const n = Object.assign({}, e, { rating });
            return n;
          }

          return e;

        });


        patchState({
          data: { ...data, learnedLetters }
        });

        dispatch( new UpdateLearnedLettersInStorage() );

      }

    }

    if ( !existLetter ) {

      const combinations = data.combinations[letter];
      const t = new LearnedLetter(letter, rating, combinations);
      const learnedLetters = [...data.learnedLetters, t];
      const lettersMenu = [ ...data.lettersMenu.filter( x => x.letter !== letter ) ];

      patchState({
        data: { ...getState().data, learnedLetters, lettersMenu }
      });

      dispatch( new UpdateLearnedLettersInStorage() );

    }

    return this._progress.sendUserProgress( new LearnedLetter(letter, 3) )
      .pipe( tap(res => console.log(res)) );

  }


  @Action( UpdateLearnedLettersInStorage )
  updateLearnedLettersInStorage({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: UpdateLearnedLettersInStorage) {

    const d = JSON.parse(localStorage.getItem('initialData'));
    const learnedLetters = getState().data.learnedLetters;
    d.learnedLetters = learnedLetters;
    localStorage.setItem('initialData', JSON.stringify(d));
  }



  /* ---------- menu handler actions ---------- */
  @Action(SetInitialDataMenu)
  setInitialDataMenu({getState, patchState}: StateContext<ReadingCourseStateModel>, action: SetInitialDataSW) {
    patchState({
      menu: {
        ...getState().menu,
        activeRedirection:  false,
        activeTab:          'alphabet',
        highlight:          null,
        selectedLetter:     '',
        sortedBy:           'alphabet'
      }
    });
  }


  @Action(ListenMessage)
  listenMessage(ctx: StateContext<ReadingCourseStateModel>, { payload }: ListenMessage) {

    this._speech.speak(payload.msg);

  }


  @Action(ChangerSorter)
  changerSorter({ patchState, getState }: StateContext<ReadingCourseStateModel>, { payload }: ChangerSorter) {
    patchState({
      menu: {
        ...getState().menu,
        sortedBy: payload.sorter
      }
    });
  }


  @Action(ChangeActiveTab)
  changeActiveTab({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: ChangeActiveTab) {


    patchState({
      menu: {
        ...getState().menu,
        activeTab: payload.tab
      }
    });

    if (payload.tab === 'alphabet') {

      const msg = 'Este es el abecedario. Selecciona una letra para continuar.';
      dispatch(new ListenMessage({ msg }));

    }

    if (payload.tab === 'learneds') {

      const hasLearnedLetters = getState().data.learnedLetters.length;
      const msg1 = 'Aquí aparecerán las letras que vayas aprendiendo';
      const msg2 = 'Estas son las letras que has aprendido';
      const msg = hasLearnedLetters === 0 ? msg1 : msg2;
      dispatch(new ListenMessage({ msg }));

    }

  }


  @Action(SelectLetter)
  selectLetter({ patchState, getState }: StateContext<ReadingCourseStateModel>, { payload }: SelectLetter) {

    patchState({
      menu: {
        ...getState().menu,
        selectedLetter: payload.letter,
      }
    });

  }


  @Action(HighlightLetter)
  highlightLetter({ patchState, getState }: StateContext<ReadingCourseStateModel>, { payload }: HighlightLetter) {

    patchState({
      menu: {
        ...getState().menu,
        highlight: payload.letter
      }
    });

  }


  @Action(ActiveRedirection)
  activeRedirection({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: ActiveRedirection) {

    dispatch(new SelectLetter({ letter: payload.letter }));

    patchState({
      menu: {
        ...getState().menu,
        activeRedirection: true
      },
      data: {
        ...getState().data,
        currentLetter: payload.letter
      }
    });

    const letter = payload.letter.toLowerCase();
    const sound  = getState().data.letterSounds[letter];
    const msg    = `Bien, Seleccionaste la letra: ... ${sound}`;
    const speech = this._speech.speak(msg);

    speech.addEventListener('end', function a() {

      dispatch( new RedirectMenu({ letter: payload.letter }) );
      speech.removeEventListener('end', a);

    });

  }


  @Action( RedirectMenu )
  redirectMenu({ dispatch }: StateContext<ReadingCourseStateModel>, { payload }: RedirectMenu) {

    const letter = payload.letter.toLowerCase();
    const url = `lectura/detalle-letra/${letter}`;
    // const url = `lectura/pronunciar-letra/${letter}`;

    dispatch([
      new Navigate([url]),
      new ResetDataMenu()
    ]);

  }


  @Action( ResetDataMenu )
  resetDataMenu({ patchState }: StateContext<ReadingCourseStateModel>, action: ResetDataMenu) {
    patchState({
      menu: null
    });
  }


  @Action( ListenSpecificLetterMenu )
  listenSpecificLetterMenu({ getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: ListenSpecificLetterMenu) {

    dispatch( new HighlightLetter({letter: payload.letter }) );

    const letter = payload.letter.toLocaleLowerCase();
    const type = payload.letter === letter ? 'minúscula' : 'mayúscula';
    const sound  = getState().data.letterSounds[letter];

    const msg = `${sound} ... ${type}`;
    const speech = this._speech.speak(msg);
    speech.addEventListener('end', function a() {

      dispatch( new HighlightLetter( {letter: null} ) );
      speech.removeEventListener('end', a);
    });

  }


  @Action( ListenSoundLetterMenu )
  listenSoundLetterMenu({ getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: ListenSoundLetterMenu) {

    dispatch(new SelectLetter({letter: payload.letter}));

    const letter = payload.letter.toLowerCase();
    const sound = getState().data.letterSounds[letter];
    const speech = this._speech.speak(sound, .8);

    speech.addEventListener('end', function a() {

      dispatch( new SelectLetter({letter: null}) );
      speech.removeEventListener('end', a);
    });

  }


  @Action( ListenWordAndLetter )
  listenWordAndLetter({ getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: ListenWordAndLetter) {

    dispatch( new SelectLetter({letter: payload.letter}) );

    const letter = payload.letter;
    const word   = payload.word;
    const lSound = getState().data.letterSounds[letter];

    if (word[0] === letter.toLowerCase() || word[0] === letter.toUpperCase()) {

      const msg    = `${word} ... comienza con la letra ... ${lSound}`;
      const speech = this._speech.speak(msg, .95);
      speech.addEventListener('end', () => dispatch(new SelectLetter({letter: ''})));

    }

    const lower = new RegExp(letter.toLowerCase().trim());

    if (word[0] !== letter.toLowerCase() && lower.test(word)) {

      const msg    = `${word} contiene la letra ... ${lSound}`;
      const speech = this._speech.speak(msg, .95);
      speech.addEventListener('end', () => dispatch(new SelectLetter({letter: ''})) );

    }
  }


  /*--------- Letter Detail Actions ---------*/
  @Action(SetInitialDataLD)
  setInitialDataLD({ getState, dispatch, patchState }: StateContext<ReadingCourseStateModel>, action: SetInitialDataLD) {

    const data = getState().data;
    this._audio.loadAudio();

    if (!data.currentLetter || !data || data.currentLetter === '') {
      dispatch(new Navigate(['/lectura/abecedario']));
    }


    if (data && data.currentLetter && data.currentLetter !== '') {

      dispatch(new IsSettingDataLD({ state: true }));

      const letterLC = data.currentLetter.toLowerCase();
      const letterUC = data.currentLetter.toUpperCase();

      const smLowerCase = [...data.similarLetters.find(x => x.letter === letterLC).similarLetters];
      const smUpperCase = [...data.similarLetters.find(x => x.letter === letterUC).similarLetters];

      const idsLower = this._ids.generateIDs(this._shuffle.shuffle(smLowerCase, letterLC, 2));
      const idsUpper = this._ids.generateIDs(this._shuffle.shuffle(smUpperCase, letterUC, 2));

      const dataLowerCase = new SLData(letterLC, idsLower, 'minúscula');
      const dataUpperCase = new SLData(letterUC, idsUpper, 'mayúscula');

      patchState({
        ...getState(),
        letterDetail: {
          ...getState().letterDetail,
          data: [dataLowerCase, dataUpperCase],
          selections: { selection1: null, selection2: null },
          currentIndex: null,
          currentData: null,
          showLetterCard: false,
          showAllCards: true,
          canPlayGame: false,
          showSuccessScreen: false,
        }
      });

      dispatch([
        new SetCurrentData(),
        new IsSettingDataLD({ state: false }),
        new ShowLetterCardLD()
      ]);

    }


  }


  @Action(SetCurrentData)
  setCurrentData({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, action: SetCurrentData) {

    const state = getState().letterDetail;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    if (nextIndex < state.data.length) {
      patchState({
        letterDetail: {
          ...getState().letterDetail,
          currentIndex: nextIndex,
          currentData: state.data[nextIndex],
          showAllCards: true
        }
      });

    }


  }


  @Action(IsSettingDataLD)
  isSettingDataLD({ patchState, getState }: StateContext<ReadingCourseStateModel>, { payload }: IsSettingDataLD) {
    patchState({
      letterDetail: {
        ...getState().letterDetail,
        isSettingData: payload.state
      }
    });
  }


  @Action(ShowLetterCardLD) // prensent letter card
  showLetterCardLD({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, action: ShowLetterCardLD) {

    const state = getState();
    const letter = state.data.currentLetter;
    const sound = state.data.letterSounds[letter];
    const type = state.letterDetail.currentData.type;
    const msg = `Esta letra es la ... ... ${sound} ... ${type}`;

    patchState({
      letterDetail: { ...state.letterDetail, showLetterCard: true }
    });

    dispatch(new ListenMessage({ msg }));

  }


  @Action(HideLetterCardLD) // prensent letter card
  hideLetterCardLD({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: HideLetterCardLD) {

    patchState({
      letterDetail: {
        ...getState().letterDetail,
        showLetterCard: false
      }
    });

    if (payload.listenMsg) {

      const state = getState();
      const letter = state.letterDetail.currentData.letter.toLowerCase();
      const sound = state.data.letterSounds[letter];
      const type = state.letterDetail.currentData.type;
      const msg = `Encuentra la pareja de letras: ${sound}.. "${type}"`;

      this._speech.speak(msg).addEventListener('end', () => dispatch(new HideAllCardsLD()));

    }

  }


  @Action(ShowAllCardsLD)
  showAllCardsLD({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: ShowAllCardsLD) {
    patchState({
      letterDetail: {
        ...getState().letterDetail,
        showAllCards: true,
        canPlayGame: false
      }
    });
  }


  @Action(HideAllCardsLD)
  hideAllCardsLD({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: HideAllCardsLD) {

    patchState({
      letterDetail: {
        ...getState().letterDetail,
        showAllCards: false,
        canPlayGame: true,
        selections: {
          selection1: null,
          selection2: null
        }
      }
    });

  }


  @Action(SelectLetterLD)
  selectLetterLD({ getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: SelectLetterLD) {

    const ldData = getState().letterDetail;
    const letter = ldData.currentData.letter;
    const sel = ldData.selections;
    const isCorrect = payload.letterId[0] === letter;
    const letterId = payload.letterId;

    return !sel.selection1
      ? dispatch(new AddFirstSelectionLD({ letterId, isCorrect }))
      : dispatch(new AddSecondSelectionLD({ letterId, isCorrect }));

  }


  @Action(AddFirstSelectionLD)
  addFirstSelectionLD({ getState, patchState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: AddFirstSelectionLD) {

    const state = getState();
    const stateLD = state.letterDetail;
    const letter = payload.letterId[0].toLowerCase();

    patchState({
      letterDetail: {
        ...stateLD,
        selections: { ...stateLD.selections, selection1: payload.letterId }
      }
    });

    if (payload.isCorrect) {

      const sound = state.data.letterSounds[letter];
      const type = stateLD.currentData.type;
      dispatch(new ListenMessage({ msg: `${sound} ${type}` }));

    }


    if (!payload.isCorrect) { this._audio.playAudio(); }

  }


  @Action(AddSecondSelectionLD)
  addSecondSelectionLD({ getState, patchState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: AddSecondSelectionLD) {


    const state = getState();
    const letter = payload.letterId[0].toLowerCase();
    const sound = state.data.letterSounds[letter];
    const type = state.letterDetail.currentData.type;
    const msg = `${sound} ${type}`;


    patchState({
      letterDetail: {
        ...state.letterDetail,
        selections: {
          ...state.letterDetail.selections,
          selection2: payload.letterId
        },
        canPlayGame: false
      }
    });


    if (payload.isCorrect) {

      const speech = this._speech.speak(msg);

      speech.addEventListener('end', function x() {
        dispatch(new ValidateSelectionsLD());
        speech.removeEventListener('end', x);
      });

    }

    if (!payload.isCorrect) {

      const audio = this._audio.playAudio();

      audio.addEventListener('ended', function x() {
        dispatch(new ValidateSelectionsLD());
        audio.removeEventListener('ended', x);
      });

    }


  }


  @Action(ValidateSelectionsLD)
  validateSelectionsLD({ getState, dispatch }: StateContext<ReadingCourseStateModel>, action: ValidateSelectionsLD) {

    const state = getState();
    const sel = state.letterDetail.selections;
    const letter = state.letterDetail.currentData.letter;
    const same = sel.selection1[0] === letter && sel.selection2[0] === letter;
    const notSame = sel.selection1[0] !== letter || sel.selection2[0] !== letter;

    return same
      ? dispatch(new LettersAreSameLD())
      : notSame
        ? dispatch(new LettersAreNotSameLD())
        : null;

  }


  @Action(LettersAreSameLD)
  lettersAreSameLD({ dispatch, getState }: StateContext<ReadingCourseStateModel>, action: LettersAreSameLD) {

    dispatch(new ShowSuccessScreenLD());

    const speech = this._speech.speak('Bien Hecho!', .90);
    speech.addEventListener('end', function a() {

      const letter = getState().data.currentLetter;
      const state = getState().letterDetail;
      const index = state.currentIndex === null ? -1 : state.currentIndex;
      const nextIndex = index + 1;

      /* Redirection */
      if (nextIndex >= state.data.length) {
        dispatch([
          new Navigate([`lectura/juego/${letter}`]),
          new ResetLetterDetailData()
        ]);

      }

      /* Change Data */
      if (nextIndex < state.data.length) {
        dispatch([
          new SetCurrentData(),
          new ShowLetterCardLD(),
          new HideSuccessScreenLD(),
        ]);
      }



      speech.removeEventListener('end', a);

    });

  }


  @Action(LettersAreNotSameLD)
  lettersAreNotSameLD({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: LettersAreSameLD) {

    patchState({
      letterDetail: {
        ...getState().letterDetail,
        canPlayGame: true,
        selections: {
          selection1: null,
          selection2: null,
        }
      },

    });

  }


  @Action(ShowSuccessScreenLD)
  showSuccessScreenLD({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: ShowSuccessScreenLD) {

    patchState({
      letterDetail: {
        ...getState().letterDetail,
        showSuccessScreen: true
      }
    });

  }


  @Action(HideSuccessScreenLD)
  hideSuccessScreenLD({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: ShowSuccessScreenLD) {

    patchState({
      letterDetail: {
        ...getState().letterDetail,
        showSuccessScreen: false
      }
    });

  }


  @Action(ResetLetterDetailData)
  resetLetterDetailData({ patchState }: StateContext<ReadingCourseStateModel>, action: ResetLetterDetailData) {
    patchState({ letterDetail: null });
  }






  /* ---------- Game handler actions ---------- */
  @Action(SetInitialDataG)
  setInitialDataG({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: SetInitialDataG) {

    dispatch(new IsSettingDataG({ state: true }));

    const state = getState();
    const letterLC = state.data.currentLetter.toLowerCase();
    const letterUC = state.data.currentLetter.toUpperCase();

    const slLowerCase = state.data.similarLetters.find(x => x.letter === letterLC).similarLetters;
    const slUpperCase = state.data.similarLetters.find(x => x.letter === letterUC).similarLetters;

    const tLC = this.genDataG(slLowerCase, letterLC, 'minúscula', payload.containerWidth);
    const tUC = this.genDataG(slUpperCase, letterUC, 'mayúscula', payload.containerWidth);


    patchState({
      game: {
        ...state.game,
        data: [tLC, tUC],
        currentIndex: -1,
        selections: {},
        showCorrectLetters: true
      }
    });

    dispatch(new SetCurrentDataG());
    setTimeout(() => dispatch([
      new IsSettingDataG({ state: false }),
      new ListenInitialMsgG()
    ]), 0);

  }


  @Action(SetCurrentDataG)
  setCurrentDataG({ patchState, getState }: StateContext<ReadingCourseStateModel>) {

    const state = getState().game;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    if (nextIndex < state.data.length) {

      patchState({
        game: {
          ...getState().game,
          currentIndex: nextIndex,
          currentData: state.data[nextIndex],
        }
      });

    }

  }


  @Action(ListenInitialMsgG)
  listenInitialMsgG({ getState, dispatch }: StateContext<ReadingCourseStateModel>, action: ListenInitialMsgG) {

    const state = getState();
    const letter = state.game.currentData.letter;
    const type = state.game.currentData.type;
    const sound = state.data.letterSounds[letter.toLowerCase()];
    const msg = `Presiona todas las letras ${sound} ${type}`;

    const speech = this._speech.speak(msg, .9);
    speech.addEventListener('end', function a() {
      dispatch(new ShowCorrectLettersG({ state: false }));
      speech.removeEventListener('end', a);
    });

  }


  @Action(IsSettingDataG)
  IsSettingDataG({ patchState, getState }: StateContext<ReadingCourseStateModel>, { payload }: IsSettingDataG) {
    patchState({
      game: {
        ...getState().game,
        isSettingData: payload.state
      }
    });
  }


  @Action(RestartDataG)
  restartDataG({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: RestartDataG) {

    dispatch(new IsSettingDataG({ state: true }));

    const currentIndex = getState().game.currentIndex;
    const state = getState();
    const letterLC = state.data.currentLetter.toLowerCase();
    const letterUC = state.data.currentLetter.toUpperCase();

    const slLowerCase = state.data.similarLetters.find(x => x.letter === letterLC).similarLetters;
    const slUpperCase = state.data.similarLetters.find(x => x.letter === letterUC).similarLetters;

    const tLC = this.genDataG(slLowerCase, letterLC, 'minúscula', payload.containerWidth);
    const tUC = this.genDataG(slUpperCase, letterUC, 'mayúscula', payload.containerWidth);
    const data = [tLC, tUC];

    patchState({
      game: {
        ...getState().game,
        data,
        currentIndex,
        currentData: data[currentIndex],
        selections: {},
      }
    });

    setTimeout(() => dispatch(new IsSettingDataG({ state: false })), 0);


  }


  @Action(SelectLetterG)
  async selectLetterG({ getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: SelectLetterG) {

    const state = getState().game;
    const correctLetter = state.currentData.letter;
    const caseLetter = state.currentData.type;
    const letterSelected = payload.letterId[0];
    const msg = `${correctLetter} ... ${caseLetter}`;

    if (letterSelected === correctLetter) {

      await dispatch([
        new IncreaseCorrectsG(),
        new RegisterLetterIdG({ letterId: payload.letterId })
      ]);

      const speech = this._speech.speak(msg);
      const count = getState().game.currentData.correctsValidation;

      if (count === 0) {

        speech.addEventListener('end', function a() {

          dispatch(new ChangeCurrentDataG());
          speech.removeEventListener('end', a);

        });

      }

    }

    if (letterSelected !== correctLetter) {
      this._audio.playAudio();
      dispatch(new IncreaseIncorrectsG());
    }


  }


  @Action(RegisterLetterIdG)
  registerLetterIdG({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: RegisterLetterIdG) {

    const count = getState().game.currentData.correctsValidation - 1;
    const selections = { ...getState().game.selections };
    selections[payload.letterId] = payload.letterId;

    patchState({
      game: {
        ...getState().game,
        selections,
        currentData: {
          ...getState().game.currentData,
          correctsValidation: count
        }

      }
    });

  }


  @Action(IncreaseCorrectsG)
  increaseCorrectsG({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: IncreaseCorrectsG) {

    const corrects = getState().game.currentData.countCorrects + 1;

    patchState({
      game: {
        ...getState().game,
        currentData: {
          ...getState().game.currentData,
          countCorrects: corrects
        }
      }
    });

  }


  @Action(IncreaseIncorrectsG)
  increaseIncorrectsG({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: IncreaseIncorrectsG) {

    const incorrects = getState().game.currentData.countIncorrects + 1;

    patchState({
      game: {
        ...getState().game,
        currentData: {
          ...getState().game.currentData,
          countIncorrects: incorrects
        }
      }
    });

  }


  @Action(ShowCorrectLettersG)
  showCorrectLettersG({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: ShowCorrectLettersG) {

    const currentOpportunities = getState().game.currentData.opportunities;
    const newCount = currentOpportunities - 1;

    if (payload.state) {
      patchState({
        game: {
          ...getState().game,
          showCorrectLetters: payload.state,
          currentData: {
            ...getState().game.currentData,
            opportunities: newCount
          }
        }
      });
    }

    if (!payload.state) {
      patchState({
        game: {
          ...getState().game,
          showCorrectLetters: payload.state,
        }
      });
    }



  }


  @Action(ShowSuccessScreenG)
  showSuccessScreenG({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: ShowSuccessScreenG) {
    patchState({
      game: {
        ...getState().game,
        showSuccessScreen: true
      }
    });
  }


  @Action(HideSuccessScreenG)
  hideSuccessScreenG({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: HideSuccessScreenG) {
    patchState({
      game: {
        ...getState().game,
        showSuccessScreen: false
      }
    });
  }


  @Action(ChangeCurrentDataG)
  changeCurrentDataG({ getState, dispatch }: StateContext<ReadingCourseStateModel>, action: ChangeCurrentDataG) {

    dispatch(new ShowSuccessScreenG());

    const letter = getState().data.currentLetter;
    const state = getState().game;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    const speech = this._speech.speak('Bien Hecho', 0.9);

    /* Redirection */
    if (nextIndex >= state.data.length) {

      speech.addEventListener('end', function a() {
        dispatch([
          new Navigate([`lectura/dibujar-letra/${letter}`]),
          new ResetDataG()
        ]);
      });

    }

    /* Set Current Data */
    if (nextIndex < state.data.length) {

      speech.addEventListener('end', function a() {
        dispatch(new SetCurrentDataG());
        dispatch(new HideSuccessScreenG());
        dispatch(new ShowCorrectLettersG({ state: true }));
        dispatch(new ListenInitialMsgG());
      });

    }


  }


  @Action(ResetDataG)
  resetDataG({ patchState }: StateContext<ReadingCourseStateModel>, action: ResetDataG) {
    patchState({ game: null });
  }


  @Action(UseHelpG)
  useHelpG({ dispatch }: StateContext<ReadingCourseStateModel>, action: UseHelpG) {

    dispatch(new ShowCorrectLettersG({ state: true }));
    setTimeout(() => dispatch(new ShowCorrectLettersG({ state: false })), 1000);
  }


  genDataG = (sl: string[], letter: string, type: string, contWidth: number) => {

    let isMobile: boolean;
    const w = window.innerWidth;
    this.store.selectSnapshot(state => isMobile = state.app.isMobile);

    const width    = isMobile ? 80 : w < 769 ? 80 : 100;
    const columns  = Math.floor(contWidth / width);
    const filas    = Math.round(35 / columns);
    const elements = columns * filas;

    const corrects = Math.floor(Math.random() * (12 - 8)) + 8;
    const elementsToInsert = elements - corrects;

    let x: string[] = [];
    const t: string[] = [];
    const result = [];

    for (let i = 0; i < corrects; i++) { x.push(letter); }
    for (let i = 0; i < 8; i++) { sl.forEach(l => t.push(l)); }
    for (let i = 0; i < elementsToInsert; i++) { x.push(t[i]); }

    x = this._shuffle.mess(x);
    x = this._ids.generateIDs(x);

    const max = x.length / columns;
    for (let i = 0; i < columns; i++) {

      const el = x.splice(0, max);
      result.push(el);

    }

    return new GData(letter, result, type, corrects, corrects, 0, 0, 3);

  }





  /* ---------- Draw Letter Actions ---------- */
  @Action(SetInitialDataDL)
  async setInitialDataDL({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, action: SetInitialDataDL) {

    const letter = getState().data.currentLetter;
    const letterUC = letter.toUpperCase();
    const letterLC = letter.toLowerCase();

    const coordinatesLC = getState().data.coordinates.find(c => c.letter === letterLC).coordinates;
    const coordinatesUC = getState().data.coordinates.find(c => c.letter === letterUC).coordinates;

    const dataLowerCase = new DrawLetterData(coordinatesLC, letterLC, 'minúscula');
    const dataUpperCase = new DrawLetterData(coordinatesUC, letterLC, 'mayúscula');

    const colors = ['#1976d2', '#f44336', '#009494', '#fc793c'];
    const configLineWidth = { min: 1, max: 24, width: 14, step: 1 };
    const configData = new ConfigData(colors, configLineWidth);
    const preferences = new Preferences(14, colors[0], true, 'round');


    const data = [dataLowerCase, dataUpperCase];

    patchState({
      drawLetter: {
        ...getState().drawLetter,
        data,
        currentIndex: -1,
        configData,
        preferences,
        showSuccessScreen: false,
      }
    });

    await dispatch([
      new SetCurrentDataDL(),
      new ShowHandwritingDL()
    ]);

    dispatch(new IsSettingDataDL({ state: false }));

  }


  @Action(IsSettingDataDL)
  isSettingDataDL({ patchState, getState }: StateContext<ReadingCourseStateModel>, { payload }: IsSettingDataDL) {
    patchState({
      drawLetter: {
        ...getState().drawLetter,
        isSettingData: payload.state
      }
    });
  }


  @Action(SetCurrentDataDL)
  setCurrentDataDL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: SetCurrentDataDL) {

    const state = getState().drawLetter;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    if (nextIndex < state.data.length) {

      patchState({
        drawLetter: {
          ...getState().drawLetter,
          currentIndex: nextIndex,
          currentData: state.data[nextIndex],
        }
      });

    }

  }


  @Action(ChangeLineWidthDL)
  changeLineWidthDL({ patchState, getState }: StateContext<ReadingCourseStateModel>, { payload }: ChangeLineWidthDL) {
    const state = getState();
    patchState({
      drawLetter: {
        ...state.drawLetter,
        configData: {
          ...state.drawLetter.configData,
          lineWidth: {
            ...state.drawLetter.configData.lineWidth,
            width: payload.lineWidth
          }
        },
        preferences: {
          ...state.drawLetter.preferences,
          lineWidth: payload.lineWidth
        }
      }
    });
  }


  @Action(ChangeLineColorDL)
  changeLineColorDL({ patchState, getState }: StateContext<ReadingCourseStateModel>, { payload }: ChangeLineColorDL) {
    const state = getState().drawLetter;
    patchState({
      drawLetter: {
        ...state,
        preferences: {
          ...state.preferences,
          lineColor: payload.color
        }
      }
    });
  }


  @Action(ToggleGuideLinesDL)
  toggleGuideLinesDL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: ToggleGuideLinesDL) {
    const state = getState();
    const stateGuideLines = state.drawLetter.preferences.showGuideLines;

    patchState({
      drawLetter: {
        ...state.drawLetter,
        preferences: {
          ...state.drawLetter.preferences,
          showGuideLines: !stateGuideLines
        }
      }
    });
  }


  @Action(ShowHandwritingDL)
  showHandwritingDL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: ShowHandwritingDL) {
    const state = getState().drawLetter;
    patchState({
      drawLetter: {
        ...state,
        showHandwriting: true
      }
    });
  }


  @Action(HideHandwritingDL)
  hideHandwritingDL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: HideHandwritingDL) {
    const state = getState().drawLetter;
    patchState({
      drawLetter: {
        ...state,
        showHandwriting: false
      }
    });
  }


  @Action(ListenHandwritingMsgDL)
  listenHandwritingMsgDL({ getState, dispatch }: StateContext<ReadingCourseStateModel>, action: ListenHandwritingMsgDL) {

    const letter = getState().drawLetter.currentData.letter.toLowerCase();
    const type = getState().drawLetter.currentData.type;
    const letterSound = getState().data.letterSounds[letter];
    const isMobile = this.store.selectSnapshot(state => state.app.isMobile);
    const queryMobileMatch = this.store.selectSnapshot(state => state.app.queryMobileMatch);

    if (!isMobile && !queryMobileMatch) {
      const msg = `Mira atentamente ... y practica escribir la letra: ... ${letterSound} .... "${type}"`;
      dispatch(new ListenMessage({ msg }));
    }

    if (isMobile || queryMobileMatch) {
      const msg = `Mira atentamente, así se escribe la letra: ... ${letterSound} .... "${type}"`;
      dispatch(new ListenMessage({ msg }));
    }



  }


  @Action(ShowSuccessScreenDL)
  showSuccessScreenDL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: ShowSuccessScreenDL) {
    patchState({
      drawLetter: {
        ...getState().drawLetter,
        showSuccessScreen: true
      }
    });
  }


  @Action(HideSuccessScreenDL)
  hideSuccessScreenDL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: HideSuccessScreenDL) {
    patchState({
      drawLetter: {
        ...getState().drawLetter,
        showSuccessScreen: false
      }
    });
  }


  @Action(OnDoneDL)
  onDoneDL({ dispatch, getState }: StateContext<ReadingCourseStateModel>, action: OnDoneDL) {

    dispatch([
      new ShowSuccessScreenDL(),
      new HideHandwritingDL()
    ]);

    const letter = getState().data.currentLetter.toLowerCase();
    const state = getState().drawLetter;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    const sound = getState().data.letterSounds[letter];
    const type = state.currentData.type;
    const msg = `Bien, ahora ya sabes escribir la letra: ${sound} .... "${type}"`;

    const speech = this._speech.speak(msg, 1);

    /* Redirection */
    if (nextIndex >= state.data.length) {

      speech.addEventListener('end', function a() {
        dispatch([
          new Navigate([`/lectura/encontrar-letras/${letter}`]),
          new ResetDataDL()
        ]);
        speech.removeEventListener('end', a);
      });

    }

    /* Set Current Data */
    if (nextIndex < state.data.length) {

      speech.addEventListener('end', function a() {
        dispatch(new SetCurrentDataDL());
        dispatch(new HideSuccessScreenDL());
        dispatch(new ShowHandwritingDL());
        speech.removeEventListener('end', a);
      });

    }
  }


  @Action(ResetDataDL)
  ResetDataDL({ patchState }: StateContext<ReadingCourseStateModel>, action: ResetDataDL) {
    patchState({ drawLetter: null });
  }


  @Action(ListenMsgBoardDL)
  ListenMsgBoardDL({ getState, dispatch }: StateContext<ReadingCourseStateModel>, action: ListenMsgBoardDL) {

    const letter = getState().drawLetter.currentData.letter.toLowerCase();
    const type = getState().drawLetter.currentData.type;
    const letterSound = getState().data.letterSounds[letter];

    const msg = `Bien, ahora practica escribir la letra: .... ${letterSound} ..... ${type}`;
    dispatch(new ListenMessage({ msg }));

  }





  /* ---------- Find Letter Actions ---------- */
  @Action(SetInitialDataFL)
  setInitialDataFL({ getState, patchState, dispatch }: StateContext<ReadingCourseStateModel>, action: SetInitialDataFL) {

    const letter = getState().data.currentLetter;
    const words = getState().data.words.find(w => w.letter === letter).words;
    const data = this.genDataFL(words, letter);

    let totalOfCorrects = 0;
    data.forEach( cd => totalOfCorrects += cd.corrects );

    patchState({
      findLetter: {
        ...getState().findLetter,
        currentIndex: -1,
        data,
        showCoincidences:  false,
        showSuccessScreen: false,
        totalOfCorrects,
        totalOfPendings:   totalOfCorrects
      }
    });

    dispatch(new SetCurrentDataFL());
    dispatch(new IsSettingDataFL({ state: false }));
    dispatch(new ListenInstructionsFL());

  }


  genDataFL(words: string[], letter: string): FLData[] {

    const data = [];

    words.forEach(w => {

      const word = w.toLowerCase();
      const letters = word.split('');
      const urlImg = `/assets/img-min/${word}-min.png`;
      const letterIds = this._ids.generateIDs(word.split(''));
      let corrects = 0;

      letters.forEach(l => l === letter ? corrects++ : null);

      data.push(new FLData(word, urlImg, letter, 'minúscula', corrects, letterIds, {}, {}, {}));

    });

    return data;

  }


  @Action(IsSettingDataFL)
  isSettingDataFL({ patchState, getState }: StateContext<ReadingCourseStateModel>, { payload }: IsSettingDataFL) {
    patchState({
      findLetter: {
        ...getState().findLetter,
        isSettingData: payload.state
      }
    });
  }


  @Action(SetCurrentDataFL)
  setCurrentDataFL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: SetCurrentDataFL) {

    const state = getState().findLetter;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    if (nextIndex < state.data.length) {

      patchState({
        findLetter: {
          ...getState().findLetter,
          currentIndex: nextIndex,
          currentData: state.data[nextIndex],
        }
      });

    }
  }


  @Action(SelectLetterIdFL)
  async selectLetterIdFL({ getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: SelectLetterIdFL) {

    const letter = getState().findLetter.currentData.letter;
    const letterId = payload.letterId;
    dispatch(new RegisterSelectionFL({ letterId }));

    if ( letterId[0] === letter ) {

      await dispatch( new AddCorrectSelectionFL({ letterId }) );

      const speech = this._speech.speak('correcto');
      const pendings = getState().findLetter.currentData.corrects;

      if (pendings === 0) {
        dispatch( new DisableAllFL({state: true}) );
        speech.addEventListener('end', function a() {

          dispatch(new ChangeCurrentDataFL());
          speech.removeEventListener('end', a);

        });

      }
    }

    if (letterId[0] !== letter) {
      this._audio.playAudio();
      dispatch( new AddWrongSelectionFL({ letterId }) );
    }

  }


  @Action(ShowSuccessScreenFL)
  showSuccessScreenFL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: ShowSuccessScreenFL) {
    patchState({
      findLetter: {
        ...getState().findLetter,
        showSuccessScreen: true
      }
    });
  }


  @Action(HideSuccessScreenFL)
  hideSuccessScreenFL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: HideSuccessScreenFL) {
    patchState({
      findLetter: {
        ...getState().findLetter,
        showSuccessScreen: false
      }
    });
  }


  @Action(ChangeCurrentDataFL)
  changeCurrentaDataFL({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, action: ChangeCurrentDataFL) {

    dispatch(new ShowSuccessScreenFL());

    const state = getState();
    const letter = state.data.currentLetter.toLowerCase();
    const index = state.findLetter.currentIndex === null ? -1 : state.findLetter.currentIndex;
    const nextIndex = index + 1;

    const speech = this._speech.speak('Bien Hecho', 0.9);

    /* Redirection */
    if (nextIndex >= state.findLetter.data.length) {

      speech.addEventListener('end', function a() {
        dispatch([
          new Navigate([`/lectura/seleccionar-palabras/${letter}`]),
          new ResetDataFL()
        ]);
        speech.removeEventListener('end', a);
      });

    }

    /* Set Current Data */
    if (nextIndex < state.findLetter.data.length) {

      dispatch(new SetCurrentDataFL());
      speech.addEventListener('end', function a() {

        dispatch([
          new DisableAllFL({state: false}),
          new HideSuccessScreenFL(),
          new ListenInstructionsFL()
        ]);
        speech.removeEventListener('end', a);

      });

    }
  }


  @Action(ListenInstructionsFL)
  listenInstructionsFL({ getState }: StateContext<ReadingCourseStateModel>, action: ListenInstructionsFL) {

    const state = getState();
    const letter = state.findLetter.currentData.letter.toLowerCase();
    const sound = state.data.letterSounds[letter];
    const type = state.findLetter.currentData.type;
    const word = state.findLetter.currentData.word;

    const msg = `Selecciona todas las letras ... ${sound} ... ${type}  ... de la palabra ... ${word}`;
    this._speech.speak(msg);

  }


  @Action(ResetDataFL)
  resetDataFL({ patchState }: StateContext<ReadingCourseStateModel>, action: ResetDataFL) {
    patchState({ findLetter: null });
  }


  @Action(ListenWordFL)
  listenWordFL({ getState }: StateContext<ReadingCourseStateModel>, action: ListenWordFL) {

    const word = getState().findLetter.currentData.word;
    this._speech.speak(word);

  }


  @Action(DisableAllFL)
  disableAll({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: DisableAllFL) {
    patchState({
      findLetter: {
        ...getState().findLetter,
        disableAll: payload.state
      }
    });
  }


  @Action( AddCorrectSelectionFL )
  addCorrectSelectionFL({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: AddCorrectSelectionFL) {

    const state = getState().findLetter;

    const totalOfPendings = state.totalOfPendings - 1;
    const pendings = state.currentData.corrects - 1;

    const correctSelections = {...state.currentData.correctSelections};
    correctSelections[payload.letterId] = payload.letterId;

    patchState({
      findLetter: {
        ...state,
        currentData: {
          ...state.currentData,
          correctSelections,
          corrects: pendings
        },
        totalOfPendings
      }
    });

  }


  @Action( AddWrongSelectionFL )
  addWrongSelectionFL({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: AddWrongSelectionFL) {

    const state = getState().findLetter;
    const wrongSelections = {...state.currentData.wrongSelections};
    wrongSelections[payload.letterId] = payload.letterId;

    patchState({
      findLetter: {
        ...state,
        currentData: {
          ...state.currentData,
          wrongSelections
        }
      }
    });

  }


  @Action( RegisterSelectionFL )
  registerSelectionFL({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: RegisterSelectionFL) {

    const state = getState().findLetter;
    const selections = { ...state.currentData.selections };
    selections[payload.letterId] = payload.letterId;

    patchState({
      findLetter: {
        ...state,
        currentData: {
          ...state.currentData,
          selections
        }
      }
    });

  }




  /* ---------- Select Words Actions ---------- */
  @Action( IsSettingDataSW )
  isSettingDataSW({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: IsSettingDataSW) {
    patchState({
      selectWords: {
        ...getState().selectWords,
        isSettingData: payload.state
      }
    });
  }


  @Action( SetInitialDataSW )
  async setInitialDataSW({ getState, patchState, dispatch }: StateContext<ReadingCourseStateModel>, action: SetInitialDataSW) {

    const state  = getState().data;
    const letter = state.currentLetter.toLowerCase();
    const words  = [];
    state.words.forEach(e => e.words.forEach(w => words.push(w)));

    const incorrectWords = words.filter( w => !w.includes(letter) );
    const correctWords   = words.filter( w =>  w.includes(letter) );

    const data = this.genDataSW(correctWords, incorrectWords, letter);

    patchState({
      selectWords: {
        ...getState().selectWords,
        data,
        currentIndex: -1
      }
    });

    await dispatch( new SetCurrentDataSW() );
    dispatch( new IsSettingDataSW({ state: false }) );
    dispatch( new ListenInstructionsSW() );
  }


  genDataSW = (corrects: string[], incorrects: string[], letter: string): SWData[] => {

    const data: SWData[] = [];
    const opts = [
      { letter: letter.toLowerCase(), type: 'minúscula' },
      { letter: letter.toUpperCase(), type: 'mayúscula' }
    ];


    opts.forEach( opt => {

      const maxOpts = 10;
      const totalCorrects   = this.intRandomSW(2, 6, corrects.length);
      const totalIncorrects = maxOpts - totalCorrects;

      let correctWords   = this.generateRandomWordsSW(totalCorrects, corrects);
      let incorrectWords = this.generateRandomWordsSW(totalIncorrects, incorrects);

      const words = [...correctWords, ...incorrectWords];
      let shuffleWords = this._shuffle.mess(words);

      if (opt.type === 'mayúscula' ) {

        shuffleWords   = shuffleWords.map( w => w.toUpperCase() );
        correctWords   = correctWords.map( w => w.toUpperCase() );
        incorrectWords = incorrectWords.map( w => w.toUpperCase() );

      }

      const el = new SWData(
        shuffleWords,
        correctWords,
        incorrectWords,
        opt.letter,
        opt.type,
        totalCorrects,
        totalCorrects,
        {},
        {},
        {}
      );

      data.push( el );

    });

    return data;

  }


  generateRandomWordsSW = (max: number, words: string[]): string[] => {

    const usedIndexes = [];
    const f = [];
    let count = 0;

    while (count < max) {

      const numberRandom = this.intRandomSW(0, words.length - 1);
      const verifyIndex  = usedIndexes.indexOf(numberRandom);

      if (verifyIndex === -1) {

        usedIndexes.push(numberRandom);
        f.push(words[numberRandom]);
        count++;

      }

    }

    return f;

  }


  intRandomSW = (min: number, maxi: number, length?: number): number => {

    const max = maxi > length ? length + 1 : maxi + 1;
    return Math.floor(Math.random() * (max - min)) + min;

  }


  @Action( SetCurrentDataSW )
  setCurrentDataSW({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: SetCurrentDataSW  ) {

    const state = getState().selectWords;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    if (nextIndex < state.data.length) {

      patchState({
        selectWords: {
          ...getState().selectWords,
          currentIndex: nextIndex,
          currentData: state.data[nextIndex],
        }
      });

    }
  }


  @Action( SelectWordSW )
  async selectWordSW({ getState, dispatch }: StateContext<ReadingCourseStateModel>, { payload }: SelectWordSW) {

    const word = payload.word;
    const letter = getState().selectWords.currentData.letter;
    const isCorrectSelection = word.includes(letter);

    dispatch( new RegisterSelectionSW( { word } ) );

    if ( isCorrectSelection ) {

      await dispatch( new RegisterCorrectSelectionSW({ word }) );

      const speech = this._speech.speak( word );
      const pending = getState().selectWords.currentData.totalOfPending;

      if ( pending === 0 ) {
        speech.addEventListener('end', function a() {

          dispatch( new ChangeCurrentDataSW() );

          speech.removeEventListener('end', a);
        });
      }


    }

    if ( !isCorrectSelection ) {

      dispatch( new RegisterWrongSelectionSW({ word }) );
      this._audio.playAudio();

    }

  }


  @Action( RegisterSelectionSW )
  registerSelectionSW({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: RegisterSelectionSW) {

    const word = payload.word;
    const selections = { ...getState().selectWords.currentData.selections };

    selections[word] = word;

    patchState({
      selectWords: {
        ...getState().selectWords,
        currentData: {
          ...getState().selectWords.currentData,
          selections
        }
      }
    });


  }


  @Action( RegisterCorrectSelectionSW )
  registerCorrectSelectionSW({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: RegisterCorrectSelectionSW) {

    const word = payload.word;
    const pending = getState().selectWords.currentData.totalOfPending - 1;
    const correctSelections = {...getState().selectWords.currentData.correctSelections};
    correctSelections[word] = word;

    patchState({
      selectWords: {
        ...getState().selectWords,
        currentData: {
          ...getState().selectWords.currentData,
          correctSelections,
          totalOfPending: pending
        }
      }
    });

  }


  @Action( RegisterWrongSelectionSW )
  registerWrongSelectionSW({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: RegisterWrongSelectionSW) {

    const word    = payload.word;
    const wrongSelections = { ...getState().selectWords.currentData.wrongSelections };
    wrongSelections[word] = word;

    patchState({
      selectWords: {
        ...getState().selectWords,
        currentData: {
          ...getState().selectWords.currentData,
          wrongSelections,
        }
      }
    });

  }


  @Action( ChangeCurrentDataSW )
  changeCurrentDataSW({ getState, dispatch }: StateContext<ReadingCourseStateModel>, action: ChangeCurrentDataSW) {

    dispatch(new ShowSuccessScreenSW());

    const state = getState();
    const letter = state.data.currentLetter.toLowerCase();
    const index = state.selectWords.currentIndex === null ? -1 : state.selectWords.currentIndex;
    const nextIndex = index + 1;

    const speech = this._speech.speak('Bien Hecho', 0.9);

    /* Redirection */
    if (nextIndex >= state.selectWords.data.length) {

      speech.addEventListener('end', function a() {
        dispatch([
          new Navigate([`/lectura/pronunciar-letra/${letter}`]),
          new ResetDataSW()
        ]);
        speech.removeEventListener('end', a);
      });

    }

    /* Set Current Data */
    if (nextIndex < state.selectWords.data.length) {

      dispatch(new SetCurrentDataSW());
      speech.addEventListener('end', function a() {

        dispatch([
          new HideSuccessScreenSW(),
          new ListenInstructionsSW()
        ]);
        speech.removeEventListener('end', a);

      });

    }
  }


  @Action( ShowSuccessScreenSW )
  showSuccessScreenSW({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: ShowSuccessScreenSW) {
    patchState({
      selectWords: {
        ...getState().selectWords,
        showSuccessScreen: true
      }
    });
  }


  @Action( HideSuccessScreenSW )
  hideSuccessScreenSW({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: HideSuccessScreenSW) {
    patchState({
      selectWords: {
        ...getState().selectWords,
        showSuccessScreen: false
      }
    });
  }


  @Action( ResetDataSW )
  resetDataSW({ patchState }: StateContext<ReadingCourseStateModel>, action: ResetDataSW) {

    patchState({ selectWords: null });

  }


  @Action( ListenInstructionsSW )
  listenInstructionsSW({ getState }: StateContext<ReadingCourseStateModel>, action: ListenInstructionsSW) {
    const state = getState().selectWords.currentData;
    const letter = state.letter;
    const type = state.type;
    const sound = getState().data.letterSounds[letter.toLowerCase()];

    const msg = `Selecciona todas las palabras que al menos tengan: ... una letra ${sound} ${type}`;
    this._speech.speak( msg );
  }







  /* ---------- Pronounce Letter Actions ---------- */
  @Action( IsSettingDataPL )
  isSettingDataPL({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: IsSettingDataPL) {
    patchState({

      pronounceLetter: {
        ...getState().pronounceLetter,
        isSettingData: payload.state
      }

    });
  }


  @Action( SetInitialDataPL )
  setInitialDataPL({ patchState, getState, dispatch }: StateContext<ReadingCourseStateModel>, action: SetInitialDataPL) {

    const state = getState();
    const letter = state.data.currentLetter;
    const letterUpperCase = letter.toUpperCase();
    const letterLowerCase = letter.toLowerCase();

    const dataUpperCase =  new PLData(letterUpperCase, 'mayúscula', 0);
    const dataLowerCase =  new PLData(letterLowerCase, 'minúscula', 0);

    const data = [ dataLowerCase, dataUpperCase ];

    patchState({
      pronounceLetter: {
        ...state.pronounceLetter,
        data,
        currentIndex: -1,
        isRecording: false,
        showSuccessScreen: false,
      }
    });

    dispatch( new SetCurrentDataPL() );
    dispatch( new IsSettingDataPL({state: false}) );
    dispatch( new ListenInstructionsPL() );

  }


  @Action( SetCurrentDataPL )
  setCurrentDataPL({ getState, patchState }: StateContext<ReadingCourseStateModel>, action: SetCurrentDataPL) {

    const state = getState().pronounceLetter;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    if (nextIndex < state.data.length) {

      patchState({
        pronounceLetter: {
          ...getState().pronounceLetter,
          currentIndex: nextIndex,
          currentData: state.data[nextIndex],
        }
      });

    }
  }


  @Action( ListenInstructionsPL )
  listenInstructionsPL(ctx: StateContext<ReadingCourseStateModel>, action: ListenInstructionsPL) {

    const msg   = 'Presiona el micrófono y dí Cuál es esta letra';
    const speak = this._speech.speak(msg, .96);

  }


  @Action( ListenHelpPL )
  listenHelpPL({ getState }: StateContext<ReadingCourseStateModel>, action: ListenHelpPL) {

    const letter = getState().pronounceLetter.currentData.letter.toLowerCase();
    const sound  = getState().data.letterSounds[letter];
    const type   = getState().pronounceLetter.currentData.type;
    const msg    = `Esta es la letra: ${sound} ... ${type}`;

    this._speech.speak(msg, .9);

  }


  @Action( ListenMsgWrongPL )
  listenMsgWrongPL(ctx: StateContext<ReadingCourseStateModel>, action: ListenMsgWrongPL) {

    const msg = 'intenta otra vez... Presiona el botón azul para obtener ayuda';
    this._speech.speak(msg, .95);

  }


  @Action( StartRecordingPL )
  startRecordingPL( { dispatch  }: StateContext<ReadingCourseStateModel>, action: StartRecordingPL ) {

    this._speech.cancel();
    dispatch( new ChangeStateRecordingPL({state: true}) );

    return this._recognition.record()
      .subscribe(
        res => dispatch( new HandleRecognitionResultPL({ res }) ),
        err => dispatch( new HandleRecognitionErrorPL({ err }) ),
        () =>  dispatch( new HandleRecognitionCompletePL() )
      );
  }


  @Action( HandleRecognitionResultPL )
  handleRecognitionResultPL({ dispatch, getState }: StateContext<ReadingCourseStateModel>, { payload }: HandleRecognitionResultPL) {

    console.log(payload.res);

    dispatch( new ChangeStateRecordingPL({state: false}) );
    dispatch( new IncreaseAttemptsPL() );

    const letter = getState().pronounceLetter.currentData.letter.toLowerCase();
    const type   = getState().pronounceLetter.currentData.type;

    const msgVal    = `${letter} ${type}`;

    if (payload.res === 'no-match') {

      dispatch( new ListenMsgNoSpeechPL() );

    }


    if (payload.res !== 'no-match' && payload.res.toLowerCase() !== msgVal.toLowerCase() ) {

      dispatch(new ListenMsgWrongPL());

    }


    if (payload.res.toLowerCase() === msgVal.toLowerCase()) {

      dispatch( new CorrectPronunciationPL() );

    }


  }


  @Action( HandleRecognitionErrorPL )
  handleRecognitionErrorPL({ dispatch }: StateContext<ReadingCourseStateModel>, { payload }: HandleRecognitionErrorPL) {

    const noSpeech = payload.err.error === 'no-speech'
      ? dispatch( new ListenMsgNoSpeechPL() )
      : false;
    dispatch( new ChangeStateRecordingPL({state: false}) );

  }


  @Action( HandleRecognitionCompletePL )
  handleRecognitionCompletePL({ dispatch }: StateContext<ReadingCourseStateModel>, action: HandleRecognitionCompletePL) {
    dispatch( new ChangeStateRecordingPL({state: false}) );
  }


  @Action( ChangeStateRecordingPL )
  changeStateRecordingPL({ getState, patchState }: StateContext<ReadingCourseStateModel>, { payload }: ChangeStateRecordingPL) {
    patchState({
      pronounceLetter: {
        ...getState().pronounceLetter,
        isRecording: payload.state
      }
    });
  }


  @Action( ListenMsgNoSpeechPL )
  listenMsgNoSpeechPL(ctx: StateContext<ReadingCourseStateModel>, action: ListenMsgNoSpeechPL) {
    this._speech.speak('Si dijiste algo no se escuchó!');
  }


  @Action( IncreaseAttemptsPL )
  increaseAttemptsPL( { getState, patchState }: StateContext<ReadingCourseStateModel>, action: IncreaseAttemptsPL ) {

    const attempts = getState().pronounceLetter.currentData.attempts + 1;

    patchState({
      pronounceLetter: {
        ...getState().pronounceLetter,
        currentData: {
          ...getState().pronounceLetter.currentData,
          attempts
        }
      }
    });

  }


  @Action( CorrectPronunciationPL )
  correctPronunciationPL({ getState, dispatch }: StateContext<ReadingCourseStateModel>, action: CorrectPronunciationPL) {

    dispatch( new ShowSuccessScreenPL() );

    const state = getState().pronounceLetter;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    const speech = this._speech.speak('Bien Hecho', 0.9);

    /* Redirection */
    if (nextIndex >= state.data.length) {


      speech.addEventListener('end', function a() {

        const letter = getState().data.currentLetter;
        dispatch( new UpdateLearnedLetters({ letter, rating: 4 }) );

        dispatch([
          new Navigate([`/lectura/abecedario`]),
          new ResetDataPL()
        ]);
        speech.removeEventListener('end', a);
      });


    }

    /* Set Current Data */
    if (nextIndex < state.data.length) {


      dispatch(new SetCurrentDataPL());
      speech.addEventListener('end', function a() {

        dispatch([
          new HideSuccessScreenPL(),
          new ListenInstructionsPL()
        ]);
        speech.removeEventListener('end', a);

      });


    }


  }


  @Action( ShowSuccessScreenPL )
  showSuccessScreenPL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: ShowSuccessScreenPL) {
    patchState({
      pronounceLetter: {
        ...getState().pronounceLetter,
        showSuccessScreen: true
      }
    });
  }


  @Action( HideSuccessScreenPL )
  hideSuccessScreenPL({ patchState, getState }: StateContext<ReadingCourseStateModel>, action: HideSuccessScreenPL) {
    patchState({
      pronounceLetter: {
        ...getState().pronounceLetter,
        showSuccessScreen: false
      }
    });
  }


  @Action( ResetDataPL )
  resetDataPL({ patchState }: StateContext<ReadingCourseStateModel>, action: ResetDataPL) {

    patchState({ pronounceLetter: null });

  }


}

