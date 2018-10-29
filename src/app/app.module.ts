import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { HomeComponent } from './home/home.component';
import { DetailCourseComponent } from './detail-course/detail-course.component';
import { LettersMenuComponent } from './read/letters-menu/letters-menu.component';
import { SpinnerLoadingComponent } from './spinner-loading/spinner-loading.component';
import { LettersDetailComponent } from './read/letters-detail/letters-detail.component';
import { BoardComponent } from './read/board/board.component';
import { HandwritingComponent } from './read/handwriting/handwriting.component';
import { DrawLetterComponent } from './read/draw-letter/draw-letter.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SuccessAnimationComponent } from './success-animation/success-animation.component';
import { CatComponent } from './cat/cat.component';
import { GameComponent } from './read/game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    ToolbarComponent,
    HomeComponent,
    DetailCourseComponent,
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
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
