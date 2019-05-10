import { BrowserModule, HAMMER_GESTURE_CONFIG, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModule                       } from './material.module';
import { GestureConfig                        } from '@angular/material';
import { ServiceWorkerModule                  } from '@angular/service-worker';
import { BrowserAnimationsModule              } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule     } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import { environment                      } from '../environments/environment';
import { AppComponent                     } from './app.component';
import { CatComponent                     } from './shared/cat/cat.component';
import { HomeComponent                    } from './home/home.component';
import { GameComponent                    } from './read/game/game.component';
import { BoardComponent                   } from './read/draw-letter/board/board.component';
import { SigninComponent                  } from './auth/signin/signin.component';
import { SignupComponent                  } from './auth/signup/signup.component';
import { AnswerComponent                  } from './shared/discussion-system/answer/answer.component';
import { SearchComponent                  } from './home/search/search.component';
import { NgxsStoreModule                  } from './store/store.module';
import { CommentComponent                 } from './shared/discussion-system/comment/comment.component';
import { ToolbarComponent                 } from './shared/toolbar/toolbar.component';
import { AppRoutingModule                 } from './app-routing.module';
import { TokenInterceptor                 } from './auth/token/token.interceptor';
import { SpinnerComponent                 } from './shared/spinner/spinner.component';
import { AlphabetComponent                } from './read/letters-menu/alphabet/alphabet.component';
import { DrawLetterComponent              } from './read/draw-letter/draw-letter.component';
import { FindLetterComponent              } from './read/find-letter/find-letter.component';
import { GuideLinesComponent              } from './read/draw-letter/guide-lines/guide-lines.component';
import { HandwritingComponent             } from './read/draw-letter/handwriting/handwriting.component';
import { SelectWordsComponent             } from './read/select-words/select-words.component';
import { CardDetailsComponent             } from './course-detail/card-details/card-details.component';
import { LettersMenuComponent             } from './read/letters-menu/letters-menu.component';
import { WriteAnswerComponent             } from './shared/discussion-system/write-answer/write-answer.component';
import { WriteCommentComponent            } from './shared/discussion-system/write-comment/write-comment.component';
import { CourseDetailComponent            } from './course-detail/course-detail.component';
import { LettersDetailComponent           } from './read/letters-detail/letters-detail.component';
import { ControlCanvasComponent           } from './read/draw-letter/control-canvas/control-canvas.component';
import { LearnedLettersComponent          } from './read/letters-menu/learned-letters/learned-letters.component';
import { SpinnerLoadingComponent          } from './shared/spinner-loading/spinner-loading.component';
import { IconsUserDialogComponent         } from './auth/signup/icons-user-dialog/icons-user-dialog.component';
import { PronounceLetterComponent         } from './read/pronounce-letter/pronounce-letter.component';
import { SuccessAnimationComponent        } from './shared/success-animation/success-animation.component';
import { DiscussionSystemComponent        } from './shared/discussion-system/discussion-system.component';
import { DetailsAndCommentsComponent      } from './course-detail/details-and-comments/details-and-comments.component';
import { DeleteCommentDialogComponent     } from './shared/discussion-system/delete-comment-dialog/delete-comment-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CatComponent,
    GameComponent,
    HomeComponent,
    BoardComponent,
    SigninComponent,
    SignupComponent,
    AnswerComponent,
    SearchComponent,
    CommentComponent,
    ToolbarComponent,
    SpinnerComponent,
    AlphabetComponent,
    DrawLetterComponent,
    GuideLinesComponent,
    FindLetterComponent,
    SelectWordsComponent,
    HandwritingComponent,
    LettersMenuComponent,
    CardDetailsComponent,
    WriteAnswerComponent,
    WriteCommentComponent,
    CourseDetailComponent,
    LettersDetailComponent,
    ControlCanvasComponent,
    LearnedLettersComponent,
    SpinnerLoadingComponent,
    PronounceLetterComponent,
    IconsUserDialogComponent,
    SuccessAnimationComponent,
    DiscussionSystemComponent,
    DeleteCommentDialogComponent,
    DetailsAndCommentsComponent,
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    NgxsStoreModule,
    FormsModule,
    HttpClientModule,

    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
  ],
  entryComponents: [
    IconsUserDialogComponent,
    DeleteCommentDialogComponent
  ],
  providers: [
    Title,
    {
      provide:  HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig
    },
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi:    true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
