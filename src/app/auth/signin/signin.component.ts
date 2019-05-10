import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { Select, Store } from '@ngxs/store';
import { ChangeTitle } from '../../store/actions/app.actions';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { SigninForm } from '../models/signin-form.model';
import { AuthState } from '../../store/state/auth.state';
import { Login } from '../../store/actions/auth.actions';


export class MyErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));

  }

}


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})


export class SigninComponent implements OnInit {


  matcher:    MyErrorStateMatcher;
  signinForm: FormGroup;


  @Select(AuthState.isLoading) isLoading$: Observable<boolean>;


  constructor(
    private store: Store,
    private authService: AuthService,
  ) { }


  ngOnInit(): void {


    this.matcher = new MyErrorStateMatcher();
    this.store.dispatch( new ChangeTitle({ title: 'Weduc - Iniciar sesión' }) );


    const emailValidations = [
      Validators.required,
      Validators.email,
    ];

    const passValidations = [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
    ];

    this.signinForm = new FormGroup({
      email:    new FormControl( null, emailValidations ),
      password: new FormControl( null, passValidations ),
    });


  }


  onSubmit(): void {

    if (!this.signinForm.valid) {
      this.showErrorMsg();
      return;
    }

    const email = this.signinForm.value.email.trim();
    const password = this.signinForm.value.password.trim();

    const auth = new SigninForm(email, password);
    this.store.dispatch( new Login(auth));

  }


  showErrorMsg(): void {

    this.authService.showError(
      'Los datos ingresados no son válidos. Verifica y vuelve a intentarlo.'
    );

  }


}
