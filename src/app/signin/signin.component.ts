import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { User                } from '../classes/user';
import { AuthService         } from '../services/auth.service';
import { ErrorStateMatcher   } from '@angular/material/core';
import { Store, Select       } from '@ngxs/store';
import { Login               } from '../store/actions/auth.actions';
import { AuthState           } from '../store/state/auth.state';
import { Observable          } from 'rxjs';
import { ChangeTitle         } from '../store/actions/app.actions';
import { AppState            } from '../store/state/app.state';


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

  signinForm:     FormGroup;
  matcher =   new MyErrorStateMatcher();
  @Select(AuthState.isLoading) isLoading$: Observable<boolean>;
  @Select(AppState.isMobile)   isMobile$:  Observable<boolean>;

  constructor( private authService: AuthService, private store: Store ) { }

  ngOnInit() {

    this.store.dispatch( new ChangeTitle({title: 'Weduc - Iniciar sesión'}) );
    this.signinForm = new FormGroup({
      'email': new    FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
        ]
      ),
    });


  }


  onSubmit() {

    if (!this.signinForm.valid) {
      this.authService.showError('Los datos ingresados no son válidos. Verifica y vuelve a intentarlo.');
    }

    if (this.signinForm.valid) {

      const user = new User(this.signinForm.value.email, this.signinForm.value.password);
      this.store.dispatch( new Login(user));

    }

  }

}
