import { HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable         } from '@angular/core';
import { Observable         } from 'rxjs';
import { catchError         } from 'rxjs/operators';
import { Answer             } from '../../shared/discussion-system/models/answers';
import { HandleErrorService } from '../../shared/handle-error.service';
import { environment        } from '../../../environments/environment';
import urljoin from 'url-join';
import { Comments } from 'src/app/shared/discussion-system/models/comments';

@Injectable({
  providedIn: 'root'
})

export class DiscussionSystemService {

  apiUrl:   string;

  constructor(
    private http:      HttpClient,
    private _error:    HandleErrorService,
    ) {

      this.apiUrl   = urljoin(environment.apiUrl, 'comments');

    }


  addComment = (comment: Comments): Observable<any | Comments> => {

    const data = JSON.stringify(comment);

    return this.http.post(this.apiUrl, data)
      .pipe(
        catchError( this._error.handleError )
      );
  }

  getAllCommments = (course_id: string): Observable<any | Comments[]> => {

    const url     = urljoin(this.apiUrl, `${course_id}`);

    return this.http.get<Comments[]>(url)
      .pipe(
        catchError( this._error.handleError )
      );
  }

  deleteComment = (course_id: string, comment_id: string) => {

    const url = urljoin(this.apiUrl, course_id);
    const httpOpts = {
      params: new HttpParams()
        .set('course_id',  course_id )
        .set('comment_id', comment_id)
    };

    return this.http.delete(url, httpOpts, )
      .pipe(
        catchError( this._error.handleError )
      );

  }


  deleteAnswer = (comment_id: string, answer_id: string) => {

    const url = urljoin(this.apiUrl, `answers/${comment_id}`);
    const httpOpts = {
      params: new HttpParams()
        .set('comment_id',  comment_id )
        .set('answer_id',   answer_id  )
    };

    return this.http.delete(url, httpOpts )
      .pipe(
        catchError( this._error.handleError )
      );

  }

  addAnswer = (answer: Answer): Observable<Answer | any> => {

    const url = urljoin(this.apiUrl, 'answers');
    const data = JSON.stringify(answer);

    return this.http.post<Answer>(url, data)
      .pipe(
        catchError( this._error.handleError )
      );

  }

}

