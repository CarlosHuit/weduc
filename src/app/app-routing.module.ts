import { NgModule                 } from '@angular/core';
import { Routes, RouterModule     } from '@angular/router';
import { SigninComponent          } from './auth/signin/signin.component';
import { SignupComponent          } from './auth/signup/signup.component';
import { IsLoggedInGuard          } from './is-logged-in.guard';
import { AuthGuard                } from './auth.guard';
import { HomeComponent            } from './home/home.component';
import { LettersMenuComponent     } from './read/letters-menu/letters-menu.component';
import { LettersDetailComponent   } from './read/letters-detail/letters-detail.component';
import { GameComponent            } from './read/game/game.component';
import { DrawLetterComponent      } from './read/draw-letter/draw-letter.component';
import { FindLetterComponent      } from './read/find-letter/find-letter.component';
import { SelectWordsComponent     } from './read/select-words/select-words.component';
import { PronounceLetterComponent } from './read/pronounce-letter/pronounce-letter.component';
import { CourseDetailComponent    } from './course-detail/course-detail.component';

const routes: Routes = [

  { path: '',                                         component: HomeComponent,                   canActivate: [AuthGuard]        },
  { path: 'signin',                                   component: SigninComponent,                 canActivate: [IsLoggedInGuard]  },
  { path: 'signup',                                   component: SignupComponent,                 canActivate: [IsLoggedInGuard]  },
  { path: ':course',                                  component: CourseDetailComponent,           canActivate: [AuthGuard]        },
  { path: 'lectura/abecedario',                       component: LettersMenuComponent,            canActivate: [AuthGuard]        },
  { path: 'lectura/detalle-letra/:letter',            component: LettersDetailComponent,          canActivate: [AuthGuard]        },
  { path: 'lectura/juego/:letter',                    component: GameComponent,                   canActivate: [AuthGuard]        },
  { path: 'lectura/dibujar-letra/:letter',            component: DrawLetterComponent,             canActivate: [AuthGuard]        },
  { path: 'lectura/encontrar-letras/:letter',         component: FindLetterComponent,             canActivate: [AuthGuard]        },
  { path: 'lectura/seleccionar-palabras/:letter',     component: SelectWordsComponent,            canActivate: [AuthGuard]        },
  { path: 'lectura/pronunciar-letra/:letter',         component: PronounceLetterComponent,        canActivate: [AuthGuard]        }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
