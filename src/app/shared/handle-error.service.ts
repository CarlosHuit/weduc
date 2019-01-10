import { HttpErrorResponse } from '@angular/common/http';
import { Injectable   } from '@angular/core';
import { Store        } from '@ngxs/store';
import { Logout       } from '../store/actions/auth.actions';
import { throwError   } from 'rxjs';
import { MatSnackBar  } from '@angular/material';

@Injectable({ providedIn: 'root' })

export class HandleErrorService {
  constructor( private store: Store, private snackBar: MatSnackBar, ) {}

  handleError = (error: HttpErrorResponse) => {
    if (error.status === 401) {

      this.store.dispatch(new Logout());
      this.showError('Inicia sesión con un usuario válido', 2000);
      return throwError('Usuario Invalido');

    }
  }

  showError(message: string, time?: number) {
    this.snackBar.open(message, 'Cerrar', { duration: time || 2000 });
  }

}
