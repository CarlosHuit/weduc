import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IconsUserDialogComponent     } from './icons-user-dialog/icons-user-dialog.component';
import { Observable          } from 'rxjs';
import { ErrorStateMatcher   } from '@angular/material/core';
import { MatDialog           } from '@angular/material';
import { Store, Select       } from '@ngxs/store';
import { CustomValidator     } from './equals-validator.directive';
import { User                } from '../../classes/user';
import { AuthService         } from '../service/auth.service';
import { Signup              } from '../../store/actions/auth.actions';
import { ChangeTitle         } from '../../store/actions/app.actions';
import { AppState            } from '../../store/state/app.state';
import { AuthState } from 'src/app/store/state/auth.state';
import { SignupForm } from '../models/signup-form.model';


export class MyErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(
    control: FormControl | null,
    form:    FormGroupDirective | NgForm | null ): boolean {

      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));

  }

}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {

  signupForm: FormGroup;
  matcher =   new MyErrorStateMatcher();
  avatar:     string;
  @Select(AppState.isMobile)    isMobile$:  Observable<boolean>;
  @Select(AuthState.isLoading) isLoading$:  Observable<boolean>;

  constructor(
    private fb:           FormBuilder,
    private authService:  AuthService,
    private dialog:       MatDialog,
    private store:        Store
  ) { }

  ngOnInit() {

    this.store.dispatch( new ChangeTitle({title: 'Weduc - Crear cuenta'}) );
    this.createForm();
    setTimeout(this.openDialog, 100);

  }

  ngOnDestroy() { }


  openDialog = () => {

    const d = this.dialog.open( IconsUserDialogComponent, { disableClose: true } );
    d.afterClosed().subscribe(avatar => this.avatar = avatar);

  }


  createForm() {
    this.signupForm = this.fb.group({
      'firstName': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      'lastName':  ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      'email':     ['', [Validators.required, Validators.email]],
      'password':  ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
        ]
      ],
      'password2': ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
        ]
      ],
    });

    this.signupForm.get('password2').setValidators(
      CustomValidator.equals(this.signupForm.get('password'))
    );


  }

  onSubmit() {


    if (!this.signupForm.valid) {
      this.authService.showError('Los datos ingresados no son validos. Verifica y vuelve a intentarlo.', 3000);
    }

    if (this.signupForm.valid) {

      const email     = this.signupForm.value.email.trim();
      const lastName  = this.signupForm.value.lastName.trim();
      const password  = this.signupForm.value.password.trim();
      const firstName = this.signupForm.value.firstName.trim();
      const password2 = this.signupForm.value.password2.trim();

      const signupData = new SignupForm(email, password, password2, firstName, lastName, this.avatar);

      this.store.dispatch( new Signup(signupData) );

    }
  }
}
