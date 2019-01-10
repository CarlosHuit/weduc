import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable         } from '@angular/core';
import { Observable         } from 'rxjs';
import { catchError         } from 'rxjs/operators';
import { GetTokenService    } from '../get-token.service';
import { Comments           } from '../../classes/comments';
import { Answer             } from '../../classes/answers';
import { HandleErrorService } from '../../shared/handle-error.service';
import { environment        } from '../../../environments/environment';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class DiscussionSystemService {

  apiUrl:   string;
  httpOpts: any;

  constructor(
    private http:      HttpClient,
    private _getToken: GetTokenService,
    private _error:    HandleErrorService,
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
        catchError( this._error.handleError )
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
        catchError( this._error.handleError )
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
        catchError( this._error.handleError )
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
        catchError( this._error.handleError )
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
        catchError( this._error.handleError )
      );

  }

}

