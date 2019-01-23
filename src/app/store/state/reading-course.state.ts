import { ReadingCourseModel } from '../models/reading-course/reading-course.model';
import {
  GetInitialData,
  GetInitialDataSuccess,
  IsLoadingDataOfReadingCourse,
  SortLearnedLettersByAlphabet,
  SortLearnedLettersByRating,
} from '../actions/reading-course/reading-course-data.actions';
import {
  ChangerSorter,
  ChangeActiveTab,
  SelectLetter,
  HighlightLetter,
  ActiveRedirection,
  ListenMessage,
} from '../actions/reading-course/reading-course-menu.actions';
import { State, Action, StateContext, Selector, createSelector, Store } from '@ngxs/store';
import { GetInitialDataService } from 'src/app/services/get-data/get-initial-data.service';
import { tap } from 'rxjs/operators';
import { Navigate } from '@ngxs/router-plugin';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';
import { ReadingCourseDataModel } from '../models/reading-course/data/reading-course-data.model';
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

@State<ReadingCourseModel>({
  name: 'readingCourse',
  defaults: {
    data: null,
    letterDetail: null,
    menu: null,
    game: null
  }
})

export class ReadingCourseState {


  /* ---------- Selectors reading course data ---------- */
  @Selector()
  static hasData(state: ReadingCourseModel) {
    return state.data ? true : false;
  }

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
  static currentLetter({ data }: ReadingCourseModel) {
    return data.currentLetter;
  }



  /* ---------- Selectors reading course menu ---------- */
  @Selector()
  static sortedBy({ menu }: ReadingCourseModel) { return menu.sortedBy; }

  @Selector()
  static activeTab({ menu }: ReadingCourseModel) { return menu.activeTab; }

  @Selector()
  static selectedLetter({ menu }: ReadingCourseModel) { return menu.selectedLetter; }

  @Selector()
  static highlightLetter({ menu }: ReadingCourseModel) {
    return menu.sortedBy;
  }

  @Selector()
  static canSpeech({ menu }: ReadingCourseModel) {
    const v1 = menu.highlight;
    const v2 = menu.selectedLetter;
    const val = ((v1.letter === '' && v1.type === '') || (!v1.letter && !v1.type))
      && (v2 === '' || !v2)
      && !menu.activeRedirection;
    return val ? true : false;
  }


  static pandas(letter: string) {
    return createSelector([ReadingCourseState], (state: ReadingCourseModel) => {
      return state.data.lettersMenu.filter(x => x.letter === letter);
    });
  }



  /*---------- selectors reading course letter-detail ----------*/
  @Selector()
  static ldCurrentData({ letterDetail }: ReadingCourseModel) { return letterDetail.currentData; }

  @Selector()
  static ldIsSettingData({ letterDetail }: ReadingCourseModel) { return letterDetail.isSettingData; }

  @Selector()
  static ldShowLetterCard({ letterDetail }: ReadingCourseModel) { return letterDetail.showLetterCard; }

  @Selector()
  static ldShowAllCards({ letterDetail }: ReadingCourseModel) { return letterDetail.showAllCards; }

  @Selector()
  static ldsel1({ letterDetail }: ReadingCourseModel) { return letterDetail.selections.selection1; }

  @Selector()
  static ldsel2({ letterDetail }: ReadingCourseModel) { return letterDetail.selections.selection2; }

  @Selector()
  static ldCanPlayGame({ letterDetail }: ReadingCourseModel) { return letterDetail.canPlayGame; }

  @Selector()
  static ldshowSuccessScreen({ letterDetail }: ReadingCourseModel) { return letterDetail.showSuccessScreen; }


  /*---------- selectors reading course game ----------*/
  @Selector()
  static gIsSettingData({game }: ReadingCourseModel ) { return game.isSettingData; }

  @Selector()
  static gCurrentData({ game }: ReadingCourseModel ) { return game.currentData; }

  @Selector()
  static gCurrentLetter({ game }: ReadingCourseModel ) { return game.currentData.letter; }

  @Selector()
  static gData({ game }: ReadingCourseModel ) { return game.currentData.data; }

  @Selector()
  static gSelections({ game }: ReadingCourseModel) { return game.selections; }

  @Selector()
  static gProgress({ game }: ReadingCourseModel) {

    const t = game.currentData.totalCorrects;
    const p = game.currentData.correctsValidation;
    const x = 100 - (( p * 100 ) / t);
    return x;
  }

  @Selector()
  static gShowCorrectLetters({ game }: ReadingCourseModel) { return game.showCorrectLetters; }

  @Selector()
  static gShowSuccessScreen({ game }: ReadingCourseModel) { return game.showSuccessScreen; }

  constructor(
    private _readingCourse: GetInitialDataService,
    private _shuffle:       ShuffleService,
    private _speech:        SpeechSynthesisService,
    private _audio:         PreloadAudioService,
    private _ids:           GenerateIdsService,
    private store: Store
  ) {
    this._audio.loadAudio();
  }


  /* ---------- data handler actions ---------- */
  @Action(GetInitialData)
  getInitialData({ dispatch, getState }: StateContext<ReadingCourseModel>, action: GetInitialData) {

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
      currentLetter: '',
      similarLetters: payload.data.similarLetters
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
  listenMessage(ctx: StateContext<ReadingCourseModel>, { payload }: ListenMessage) {

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
      dispatch([
        new Navigate([payload.url]),
        new SelectLetter({ letter: '' })
      ]);
      patchState({
        menu: {
          ...getState().menu,
          activeRedirection: false
        },
        data: {
          ...getState().data,
          currentLetter: payload.letter
        }
      });

    };

    const speech = this._speech.speak(payload.msg);
    speech.addEventListener('end', () => {
      redirectionsucces();
      speech.removeEventListener('end', redirectionsucces);
    });

  }



  /*--------- Letter Detail Actions ---------*/
  @Action(SetInitialDataLD)
  setInitialDataLD({ getState, dispatch, patchState }: StateContext<ReadingCourseModel>, action: SetInitialDataLD) {

    const data = getState().data;
    this._audio.loadAudio();

    if (!data.currentLetter || !data || data.currentLetter === '') {
      dispatch(new Navigate(['/lectura/abecedario']));
    }


    if (data && data.currentLetter && data.currentLetter !== '') {

      dispatch(new IsSettingDataLD({ state: true }));

      const letterLC = data.currentLetter.toLowerCase();
      const letterUC = data.currentLetter.toUpperCase();

      const smLowerCase = [...data.similarLetters.find(x => x.l === letterLC).sl];
      const smUpperCase = [...data.similarLetters.find(x => x.l === letterUC).sl];

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
  setCurrentData({ patchState, getState, dispatch }: StateContext<ReadingCourseModel>, action: SetCurrentData) {

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
  isSettingDataLD({ patchState, getState }: StateContext<ReadingCourseModel>, { payload }: IsSettingDataLD) {
    patchState({
      letterDetail: {
        ...getState().letterDetail,
        isSettingData: payload.state
      }
    });
  }

  @Action(ShowLetterCardLD) // prensent letter card
  showLetterCardLD({ patchState, getState, dispatch }: StateContext<ReadingCourseModel>, action: ShowLetterCardLD) {

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
  hideLetterCardLD({ patchState, getState, dispatch }: StateContext<ReadingCourseModel>, { payload }: HideLetterCardLD) {

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
  showAllCardsLD({ getState, patchState }: StateContext<ReadingCourseModel>, action: ShowAllCardsLD) {
    patchState({
      letterDetail: {
        ...getState().letterDetail,
        showAllCards: true,
        canPlayGame: false
      }
    });
  }

  @Action(HideAllCardsLD)
  hideAllCardsLD({ getState, patchState }: StateContext<ReadingCourseModel>, action: HideAllCardsLD) {

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
  selectLetterLD({ getState, dispatch }: StateContext<ReadingCourseModel>, { payload }: SelectLetterLD) {

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
  addFirstSelectionLD({ getState, patchState, dispatch }: StateContext<ReadingCourseModel>, { payload }: AddFirstSelectionLD) {

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
  addSecondSelectionLD({ getState, patchState, dispatch }: StateContext<ReadingCourseModel>, { payload }: AddSecondSelectionLD) {


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
  validateSelectionsLD({ getState, dispatch }: StateContext<ReadingCourseModel>, action: ValidateSelectionsLD) {

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
  lettersAreSameLD({ dispatch, getState }: StateContext<ReadingCourseModel>, action: LettersAreSameLD) {

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
  lettersAreNotSameLD({ getState, patchState }: StateContext<ReadingCourseModel>, action: LettersAreSameLD) {

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
  showSuccessScreenLD({ getState, patchState }: StateContext<ReadingCourseModel>, action: ShowSuccessScreenLD) {

    patchState({
      letterDetail: {
        ...getState().letterDetail,
        showSuccessScreen: true
      }
    });

  }

  @Action(HideSuccessScreenLD)
  hideSuccessScreenLD({ getState, patchState }: StateContext<ReadingCourseModel>, action: ShowSuccessScreenLD) {

    patchState({
      letterDetail: {
        ...getState().letterDetail,
        showSuccessScreen: false
      }
    });

  }

  @Action(ResetLetterDetailData)
  resetLetterDetailData({ patchState }: StateContext<ReadingCourseModel>, action: ResetLetterDetailData) {
    patchState({ letterDetail: null });
  }





  /* ---------- Game handler actions ---------- */
  @Action(SetInitialDataG)
  setInitialDataG( { patchState, getState, dispatch }: StateContext<ReadingCourseModel>, { payload }: SetInitialDataG ) {

    dispatch(new IsSettingDataG({ state: true }));

    const state = getState();
    const letterLC = state.data.currentLetter.toLowerCase();
    const letterUC = state.data.currentLetter.toUpperCase();

    const slLowerCase = state.data.similarLetters.find(x => x.l === letterLC).sl;
    const slUpperCase = state.data.similarLetters.find(x => x.l === letterUC).sl;

    const tLC = this.genDataG(slLowerCase, letterLC, 'minúscula', payload.containerWidth);
    const tUC = this.genDataG(slUpperCase, letterUC, 'mayúscula', payload.containerWidth);


    patchState({
      game: {
        ...state.game,
        data:               [ tLC, tUC ],
        currentIndex:       -1,
        selections:         {},
        showCorrectLetters: true
      }
    });

    dispatch( new SetCurrentDataG() );
    setTimeout(() => dispatch( [
      new IsSettingDataG({state: false}),
      new ListenInitialMsgG()
    ]), 0);

  }

  @Action(SetCurrentDataG)
  setCurrentDataG({ patchState, getState }: StateContext<ReadingCourseModel>) {

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
  listenInitialMsgG( { getState, dispatch }: StateContext<ReadingCourseModel>, action: ListenInitialMsgG ) {

    const state = getState();
    const letter = state.game.currentData.letter;
    const type = state.game.currentData.type;
    const sound = state.data.letterSounds[letter.toLowerCase()];
    const msg = `Presiona todas las letras ${sound} ${type}`;

    const speech = this._speech.speak(msg, .9);
    speech.addEventListener('end', function a() {
      dispatch(new ShowCorrectLettersG({state: false}));
      speech.removeEventListener('end', a);
    });

  }

  @Action(IsSettingDataG)
  IsSettingDataG({ patchState, getState }: StateContext<ReadingCourseModel>, { payload }: IsSettingDataG ) {
    patchState({
      game: {
        ...getState().game,
        isSettingData: payload.state
      }
    });
  }

  @Action(RestartDataG)
  restartDataG({ patchState, getState, dispatch }: StateContext<ReadingCourseModel>, { payload }: RestartDataG) {

    dispatch(new IsSettingDataG({ state: true }));

    const currentIndex = getState().game.currentIndex;
    const state = getState();
    const letterLC = state.data.currentLetter.toLowerCase();
    const letterUC = state.data.currentLetter.toUpperCase();

    const slLowerCase = state.data.similarLetters.find(x => x.l === letterLC).sl;
    const slUpperCase = state.data.similarLetters.find(x => x.l === letterUC).sl;

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

    setTimeout(() => dispatch( new IsSettingDataG({state: false}) ) , 0);


  }

  @Action(SelectLetterG)
  async selectLetterG( { getState, dispatch }: StateContext<ReadingCourseModel>, { payload }: SelectLetterG ) {

    const state = getState().game;
    const correctLetter = state.currentData.letter;
    const caseLetter    = state.currentData.type;
    const letterSelected = payload.letterId[0];
    const msg = `${correctLetter} ... ${caseLetter}`;

    if (letterSelected === correctLetter) {

      await dispatch([
        new IncreaseCorrectsG(),
        new RegisterLetterIdG({letterId: payload.letterId})
      ]);

      const speech = this._speech.speak(msg);
      const count  = getState().game.currentData.correctsValidation;

      if (count === 0) {

        speech.addEventListener('end', function a() {

          dispatch( new ChangeCurrentDataG() );
          speech.removeEventListener('end', a);

        });

      }

    }

    if ( letterSelected !== correctLetter ) {
      this._audio.playAudio();
      dispatch( new IncreaseIncorrectsG() );
    }


  }

  @Action(RegisterLetterIdG)
  registerLetterIdG({ getState, patchState }: StateContext<ReadingCourseModel>, { payload }: RegisterLetterIdG) {

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
  increaseCorrectsG({ getState, patchState }: StateContext<ReadingCourseModel>, action: IncreaseCorrectsG) {

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
  increaseIncorrectsG({ patchState, getState }: StateContext<ReadingCourseModel>, action: IncreaseIncorrectsG ) {

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
  showCorrectLettersG({ getState, patchState }: StateContext<ReadingCourseModel>, { payload }: ShowCorrectLettersG) {

    const currentOpportunities = getState().game.currentData.opportunities;
    const newCount = currentOpportunities - 1;

    if ( payload.state ) {
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

    if ( !payload.state ) {
      patchState({
        game: {
          ...getState().game,
          showCorrectLetters: payload.state,
        }
      });
    }



  }

  @Action(ShowSuccessScreenG)
  showSuccessScreenG({ getState, patchState }: StateContext<ReadingCourseModel>, action: ShowSuccessScreenG) {
    patchState({
      game: {
        ...getState().game,
        showSuccessScreen: true
      }
    });
  }

  @Action(HideSuccessScreenG)
  hideSuccessScreenG({ getState, patchState }: StateContext<ReadingCourseModel>, action: HideSuccessScreenG) {
    patchState({
      game: {
        ...getState().game,
        showSuccessScreen: false
      }
    });
  }

  @Action(ChangeCurrentDataG)
  changeCurrentDataG({ getState, dispatch }: StateContext<ReadingCourseModel>, action: ChangeCurrentDataG) {

    dispatch( new ShowSuccessScreenG() );

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
        dispatch( new SetCurrentDataG());
        dispatch( new HideSuccessScreenG());
        dispatch( new ShowCorrectLettersG({state: true}) );
        dispatch( new ListenInitialMsgG() );
      });

    }


  }

  @Action(ResetDataG)
  resetDataG({ patchState }: StateContext<ReadingCourseModel>, action: ResetDataG) {
    patchState({ game: null });
  }

  @Action(UseHelpG)
  useHelpG({ dispatch }: StateContext<ReadingCourseModel>, action: UseHelpG) {

    dispatch(new ShowCorrectLettersG({state: true}));
    setTimeout(() =>  dispatch(new ShowCorrectLettersG({state: false})), 1000);
  }

  genDataG = (sl: string[], letter: string, type: string, contWidth: number) => {

    let isMobile: boolean;
    const w = window.innerWidth;
    this.store.selectSnapshot(state => isMobile =  state.app.isMobile);

    const width = isMobile ? 80 : w < 640 ? 80 : 100;
    // const width   = isMobile ? 80 : 100; // ancho del cubo
    const columns = Math.floor(contWidth / width);
    const filas = Math.round(35 / columns);
    const elements = columns * filas;

    const corrects = Math.floor(Math.random() * (12 - 8)) + 8;
    const elementsToInsert = elements - corrects;

    const x: string[] = [];
    const t: string[] = [];
    const result = [];

    for (let i = 0; i < corrects; i++) { x.push(letter); }

    for (let i = 0; i < 8; i++) { sl.forEach(l => t.push(l)); }

    for (let i = 0; i < elementsToInsert; i++) { x.push(t[i]); }

    this._shuffle.mess(x);
    this._ids.generateIDs(x);

    const max    = x.length / columns;
    for (let i = 0; i < columns; i++) {

      const el = x.splice(0, max);
      result.push(el);

    }

    return new GData( letter, result, type, corrects, corrects, 0, 0, 3);

  }


}

