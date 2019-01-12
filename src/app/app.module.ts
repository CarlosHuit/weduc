import { BrowserModule, HAMMER_GESTURE_CONFIG, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModule                       } from './material.module';
import { ReactiveFormsModule, FormsModule     } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { GestureConfig                        } from '@angular/material';
import { ServiceWorkerModule                  } from '@angular/service-worker';
import { BrowserAnimationsModule              } from '@angular/platform-browser/animations';

import { AppRoutingModule                 } from './app-routing.module';
import { AppComponent                     } from './app.component';
import { environment                      } from '../environments/environment';
import { TokenInterceptor                 } from './auth/token/token.interceptor';
import { IconsUserDialogComponent         } from './auth/signup/icons-user-dialog/icons-user-dialog.component';
import { SigninComponent                  } from './auth/signin/signin.component';
import { SignupComponent                  } from './auth/signup/signup.component';
import { ToolbarComponent                 } from './shared/toolbar/toolbar.component';
import { HomeComponent                    } from './home/home.component';
import { CourseDetailComponent            } from './course-detail/course-detail.component';
import { DetailsAndCommentsComponent      } from './course-detail/details-and-comments/details-and-comments.component';
import { CardDetailsComponent             } from './course-detail/card-details/card-details.component';
import { LettersMenuComponent             } from './read/letters-menu/letters-menu.component';
import { SpinnerLoadingComponent          } from './shared/spinner-loading/spinner-loading.component';
import { LettersDetailComponent           } from './read/letters-detail/letters-detail.component';
import { BoardComponent                   } from './read/board/board.component';
import { HandwritingComponent             } from './read/handwriting/handwriting.component';
import { DrawLetterComponent              } from './read/draw-letter/draw-letter.component';
import { SpinnerComponent                 } from './shared/spinner/spinner.component';
import { SuccessAnimationComponent        } from './shared/success-animation/success-animation.component';
import { CatComponent                     } from './shared/cat/cat.component';
import { GameComponent                    } from './read/game/game.component';
import { FindLetterComponent              } from './read/find-letter/find-letter.component';
import { SelectWordsComponent             } from './read/select-words/select-words.component';
import { PronounceLetterComponent         } from './read/pronounce-letter/pronounce-letter.component';
import { ControlCanvasComponent           } from './read/control-canvas/control-canvas.component';
import { GuideLinesComponent              } from './read/guide-lines/guide-lines.component';
import { DiscussionSystemComponent        } from './shared/discussion-system/discussion-system.component';
import { DeleteCommentDialogComponent     } from './shared/discussion-system/delete-comment-dialog/delete-comment-dialog.component';
import { CommentComponent                 } from './shared/discussion-system/comment/comment.component';
import { WriteCommentComponent            } from './shared/discussion-system/write-comment/write-comment.component';
import { WriteAnswerComponent             } from './shared/discussion-system/write-answer/write-answer.component';
import { AnswerComponent                  } from './shared/discussion-system/answer/answer.component';
import { LearnedLettersComponent          } from './read/letters-menu/learned-letters/learned-letters.component';
import { AlphabetComponent                } from './read/letters-menu/alphabet/alphabet.component';
import { SearchComponent                  } from './home/search/search.component';
import { NgxsStoreModule                  } from './store/store.module';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    ToolbarComponent,
    HomeComponent,
    LettersMenuComponent,
    SpinnerLoadingComponent,
    LettersDetailComponent,
    BoardComponent,
    HandwritingComponent,
    DrawLetterComponent,
    SpinnerComponent,
    SuccessAnimationComponent,
    CatComponent,
    GameComponent,
    FindLetterComponent,
    SelectWordsComponent,
    PronounceLetterComponent,
    ControlCanvasComponent,
    GuideLinesComponent,
    DiscussionSystemComponent,
    IconsUserDialogComponent,
    DeleteCommentDialogComponent,
    CommentComponent,
    WriteCommentComponent,
    WriteAnswerComponent,
    AnswerComponent,
    DetailsAndCommentsComponent,
    CardDetailsComponent,
    LearnedLettersComponent,
    AlphabetComponent,
    SearchComponent,
    CourseDetailComponent,
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
