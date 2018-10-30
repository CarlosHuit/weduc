import { NgModule } from '@angular/core';
import { Routes, RouterModule   } from '@angular/router';
import { SigninComponent        } from './signin/signin.component';
import { SignupComponent        } from './signup/signup.component';
import { IsLoggedInGuard        } from './is-logged-in.guard';
import { AuthGuard              } from './auth.guard';
import { HomeComponent          } from './home/home.component';
import { DetailCourseComponent  } from './detail-course/detail-course.component';
import { LettersMenuComponent   } from './read/letters-menu/letters-menu.component';
import { LettersDetailComponent } from './read/letters-detail/letters-detail.component';
import { GameComponent          } from './read/game/game.component';
import { DrawLetterComponent    } from './read/draw-letter/draw-letter.component';
import { FindLetterComponent    } from './read/find-letter/find-letter.component';
// import { TargetComponent       } from './read/target/target.component';
// import { GuessLetterComponent  } from './read/guess-letter/guess-letter.component';
// import { CompleteWordComponent } from './read/complete-word/complete-word.component';
// import { ProofComponent                 } from './read/proof/proof.component';
// import { PracticePronunciationComponent } from './read/practice-pronunciation/practice-pronunciation.component';
// import { SelectImagesComponent          } from './read/select-images/select-images.component';
// import { SelectWordsComponent           } from './read/select-words/select-words.component';
// import { IdentifyLetterComponent        } from './read/identify-letter/identify-letter.component';
// import { WriterComponent                } from './read/writer/writer.component';

const routes: Routes = [

  { path: 'signin',                           component: SigninComponent,                 canActivate: [IsLoggedInGuard]  },
  { path: 'signup',                           component: SignupComponent,                 canActivate: [IsLoggedInGuard]  },
  { path: '',                                 component: HomeComponent,                   canActivate: [AuthGuard]        },
  { path: ':course',                          component: DetailCourseComponent,           canActivate: [AuthGuard]        },
  { path: 'lectura/abecedario',               component: LettersMenuComponent,            canActivate: [AuthGuard]        },
  { path: 'lectura/detalle-letra/:letter',    component: LettersDetailComponent,          canActivate: [AuthGuard]        },
  { path: 'lectura/juego/:letter',            component: GameComponent,                   canActivate: [AuthGuard]        },
  { path: 'lectura/dibujar-letra/:letter',    component: DrawLetterComponent,             canActivate: [AuthGuard]        },
  { path: 'lectura/encontrar-letra/:letter',  component: FindLetterComponent,             canActivate: [AuthGuard]        },
  // { path: 'leer/target/:letter',              component: TargetComponent,                canActivate: [AuthGuard]        },
  // { path: 'leer/select-images/:letter',       component: SelectImagesComponent,          canActivate: [AuthGuard]        },
  // { path: 'leer/game/:letter',                component: GameComponent,                  canActivate: [AuthGuard]        },
  // { path: 'leer/identificar-letra/:letter',   component: IdentifyLetterComponent,        canActivate: [AuthGuard]        },
  // { path: 'leer/adivina-la-letra/:letter',    component: GuessLetterComponent,           canActivate: [AuthGuard]        },
  // { path: 'leer/select-words/:letter',        component: SelectWordsComponent,           canActivate: [AuthGuard]        },
  // { path: 'leer/completar-palabra/:letter',   component: CompleteWordComponent,          canActivate: [AuthGuard]        },
  // { path: 'leer/completar-palabra/:letter',   component: CompleteWordComponent,          canActivate: [AuthGuard]        },
  // { path: 'leer/escribir/:letter',            component: WriterComponent,                canActivate: [AuthGuard]        },

  // { path: 'leer/proof/:letter',               component:  ProofComponent,                canActivate: [AuthGuard]        },
  // { path: 'leer/pronunciacion/:letter',       component: PracticePronunciationComponent, canActivate: [AuthGuard]        },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
