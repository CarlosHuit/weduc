import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Injectable             } from '@angular/core';
import { environment            } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError             } from 'rxjs/operators';
import { GetTokenService        } from '../get-token.service';
import { Router                 } from '@angular/router';
import { AuthService            } from '../auth.service';
import { Subjects               } from '../../classes/subjects';
import urljoin from 'url-join';




@Injectable({ providedIn: 'root' })

export class GetCoursesService {


  apiUrl:   string;
  httpOpts: any;

  constructor(
    private _router:  Router,
    private http:     HttpClient,
    private _auth:    AuthService,
    private getToken: GetTokenService,
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'courses');
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

  }


  getCourses = (): Observable<any | Subjects[]> => {

    const url     = this.apiUrl;
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.get(url, this.httpOpts)
    .pipe(
      catchError(this.handleError)
    );
  }

  getCourseData = (course: string): Observable<any | Subjects> => {

    const url = urljoin(this.apiUrl, course);
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.get<Subjects>(url, this.httpOpts)
      .pipe(
        catchError(this.handleError)
      );

  }



  handleError = (error: HttpErrorResponse) => {

    if (error.status === 401) {
      this._router.navigateByUrl('');
      this._auth.logout();
      this._auth.showError('Inicia sesión con un usuario válido', 2000);
      return throwError('Usuario Invalido');
    }

  }

}
