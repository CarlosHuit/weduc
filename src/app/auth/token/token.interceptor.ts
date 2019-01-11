import { Injectable   } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable   } from 'rxjs';
import { Select       } from '@ngxs/store';
import { AuthState    } from '../../store/state/auth.state';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  token: string;
  @Select(AuthState.getToken) token$: Observable<string>;

  constructor() {
    this.token$.subscribe( token => this.token = token );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${this.token}`
      }
    });
    return next.handle(request);
  }

}
