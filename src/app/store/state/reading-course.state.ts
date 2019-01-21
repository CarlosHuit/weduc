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
import { State, Action, StateContext, Selector, createSelector } from '@ngxs/store';
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

@State<ReadingCourseModel>({
  name: 'readingCourse',
})

export class ReadingCourseState {


  /* Selectors reading course data */
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



  /* Selector menu */
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
      console.log('you send the letter:' + letter);
      return state.data.lettersMenu.filter(x => x.letter === letter);
    });
  }



  /*---- selectors letter-detail ----*/
  @Selector()
  static sLCurrentData({ letterDetail }: ReadingCourseModel) { return letterDetail.currentData; }

  @Selector()
  static sLIsSettingData({ letterDetail }: ReadingCourseModel) { return letterDetail.isSettingData; }

  @Selector()
  static sLShowLetterCard({ letterDetail }: ReadingCourseModel) { return letterDetail.showLetterCard; }

  @Selector()
  static sLShowAllCards({ letterDetail }: ReadingCourseModel) { return letterDetail.showAllCards; }

  @Selector()
  static sLsel1({ letterDetail }: ReadingCourseModel) { return letterDetail.selections.selection1; }

  @Selector()
  static sLsel2({ letterDetail }: ReadingCourseModel) { return letterDetail.selections.selection2; }

  @Selector()
  static sLCanPlayGame({ letterDetail }: ReadingCourseModel) { return letterDetail.canPlayGame; }

  @Selector()
  static sLshowSuccessScreen({ letterDetail }: ReadingCourseModel) { return letterDetail.showSuccessScreen; }

  constructor(
    private _readingCourse: GetInitialDataService,
    private _speech: SpeechSynthesisService,
    private _shuffle: ShuffleService,
    private _ids: GenerateIdsService,
    private _audio: PreloadAudioService,
  ) { }


  /* ---------- data handler actions ---------- */
  @Action(GetInitialData)
  getInitialData({ dispatch, getState }: StateContext<ReadingCourseModel>, action: GetInitialData) {

    const hasData = getState().data ? true : false;

    if (hasData) {
      console.log('not request data');
      dispatch([
        new SortLearnedLettersByAlphabet(),
        new ChangeActiveTab({ tab: 'alphabet' }),
        new IsLoadingDataOfReadingCourse({ state: false }),
        new ListenMessage({ msg: 'Este es el abecedario. Selecciona una letra para continuar.' }),
      ]);
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

    const letter = getState().data.currentLetter;
    const state = getState().letterDetail;
    const index = state.currentIndex === null ? -1 : state.currentIndex;
    const nextIndex = index + 1;

    if (nextIndex >= state.data.length) {
      dispatch( new Navigate([`lectura/juego/${letter}`]) );
    }

    if (nextIndex < state.data.length) {
      console.log(new Date(), 'settingData', `nextIndex ${nextIndex}`);
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
  lettersAreSameLD({ dispatch }: StateContext<ReadingCourseModel>, action: LettersAreSameLD) {

    dispatch(new ShowSuccessScreenLD());

    const speech = this._speech.speak('Bien Hecho!', .90);
    speech.addEventListener('end', function a() {

      dispatch(new SetCurrentData());
      dispatch([
        new HideSuccessScreenLD(),
        new ShowLetterCardLD()
      ]);

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
  resetLetterDetailData( { patchState }: StateContext<ReadingCourseModel>, action: ResetLetterDetailData ) {
    patchState({ letterDetail: null });
  }

}


