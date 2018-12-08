import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams  } from '@angular/common/http';
import { Injectable                 } from '@angular/core';
import { environment                } from '../../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map            } from 'rxjs/operators';
import { GetTokenService            } from '../get-token.service';
import { LocalStorageService        } from '../local-storage.service';
import { Router                     } from '@angular/router';
import { AuthService                } from '../auth.service';
import { Comments                   } from '../../classes/comments';
import { Answers, Answer                    } from '../../classes/answers';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class DiscussionSystemService {

  apiUrl:   string;
  httpOpts: any;

  constructor(
    private _router:   Router,
    private http:      HttpClient,
    private _auth:     AuthService,
    private _getToken: GetTokenService,
    private _storage:  LocalStorageService,
    ) {

      this.apiUrl   = urljoin(environment.apiUrl, 'comments');
      const x       = { 'Content-Type': 'application/json', 'Authorization': `${this._getToken.addToken()}` };
      this.httpOpts = { headers: new HttpHeaders(x) };

    }


  addComment = (comment: Comments): Observable<any | Comments> => {

    const data = JSON.stringify(comment);
    this.httpOpts = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': `${this._getToken.addToken()}`
        }
      )
    };

    return this.http.post(this.apiUrl, data, this.httpOpts)
      .pipe(
        catchError( this.handleError )
      );
  }

  getAllCommments = (course_id: string): Observable<any | Comments[]> => {

    const url     = urljoin(this.apiUrl, `${course_id}`);
    this.httpOpts = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': `${this._getToken.addToken()}`
        }
      )
    };

    return this.http.get<Comments[]>(url, this.httpOpts)
      .pipe(
        catchError( this.handleError )
      );
  }

  deleteComment = (course_id: string, comment_id: string) => {

    const url = urljoin(this.apiUrl, course_id);
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `${this._getToken.addToken()}`
      }),
      params: new HttpParams()
        .set('course_id',  course_id )
        .set('comment_id', comment_id)
    };

    return this.http.delete(url, this.httpOpts, )
      .pipe(
        catchError( this.unauthorized )
      );

  }


  deleteAnswer = (comment_id: string, answer_id: string) => {

    const url = urljoin(this.apiUrl, `answers/${comment_id}`);
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `${this._getToken.addToken()}`
      }),
      params: new HttpParams()
        .set('comment_id',  comment_id )
        .set('answer_id',   answer_id  )
    };

    return this.http.delete(url, this.httpOpts, )
      .pipe(
        catchError( this.unauthorized )
      );

  }

  addAnswer = (answer: Answer): Observable<Answer | any> => {
    const url = urljoin(this.apiUrl, 'answers');
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `${this._getToken.addToken()}`
      })
    };
    const data = JSON.stringify(answer);

    return this.http.post<Answer>(url, data, this.httpOpts)
      .pipe(
        catchError( this.handleError )
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

  unauthorized = (error: HttpErrorResponse) => {
    if ( error.status === 401 ) {
      return throwError('Unauthorized');
    }
  }

}

