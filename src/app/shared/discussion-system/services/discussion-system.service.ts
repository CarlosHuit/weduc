import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from 'src/app/models/discussion-system/comment.model';
import { CommentForm } from 'src/app/models/discussion-system/forms/comment-form.model';
import urljoin from 'url-join';
import { environment } from '../../../../environments/environment';
import { HandleErrorService } from '../../handle-error.service';
import { Answer } from '../models/answers';

@Injectable({
  providedIn: 'root'
})

export class DiscussionSystemService {

  baseApiUrl:   string;

  constructor(
    private http:      HttpClient,
    private _error:    HandleErrorService,
  ) {

    this.baseApiUrl   = urljoin(environment.apiUrl, 'courses');

  }


  addComment(comment: CommentForm): Observable<Comment> {

    const data = JSON.stringify(comment);

    return this.http.post<Comment>(this.baseApiUrl, data)
      .pipe(
        catchError( this._error.handleError )
      );
  }


  getCommentsCourse(courseName: string): Observable<Comment[]> {

    const url = urljoin(this.baseApiUrl, courseName, 'comments');

    return this.http.get<Comment[]>(url)
      .pipe(
        catchError( this._error.handleError )
      );
  }


  deleteComment(course_id: string, comment_id: string) {

    const url = urljoin(this.baseApiUrl, course_id);
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



  deleteAnswer(comment_id: string, answer_id: string) {

    const url = urljoin(this.baseApiUrl, `answers/${comment_id}`);
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


  addAnswer(answer: Answer): Observable<Answer> {

    const url = urljoin(this.baseApiUrl, 'answers');
    const data = JSON.stringify(answer);

    return this.http.post<Answer>(url, data)
      .pipe(
        catchError( this._error.handleError )
      );

  }


}

