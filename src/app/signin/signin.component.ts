import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { User                } from '../classes/user';
import { AuthService         } from '../services/auth.service';
import { ErrorStateMatcher   } from '@angular/material/core';
import { DetectMobileService } from '../services/detect-mobile.service';
import { Router } from '@angular/router';


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

export class SigninComponent implements OnInit, OnDestroy {

  signinForm: FormGroup;
  matcher =   new MyErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private _mobile:     DetectMobileService,
    private _router:     Router
  ) { }

  ngOnInit() {


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

    window.addEventListener('resize', this.isMobile);

  }


  ngOnDestroy() {
    window.removeEventListener('resize', this.isMobile);
  }


  isMobile = () => {
    return this._mobile.isMobile();
  }

  goToHome = () => {
    this._router.navigateByUrl('');
  }

  onSubmit() {


    if (!this.signinForm.valid) {
      this.authService.showError('Los datos ingresados no son válidos. Verifica y vuelve a intentarlo.');
    }

    if (this.signinForm.valid) {

      const { email, password } = this.signinForm.value;
      const user = new User(email, password);

      this.authService.signin(user)
        .subscribe(
          this.authService.login,
          this.authService.handleError
        );
    }
  }



}
