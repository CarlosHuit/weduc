import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import urljoin from 'url-join';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DrawLetterData } from '../read/draw-letter/draw-letter.component';
// import { CompleteWordData } from '../read/complete-word/complete-word.component';
import { GetTokenService } from '../services/get-token.service';
// import { FindLetter } from '../read/find-letter/find-letter.component';
// import { SelectWords } from '../read/select-words/select-words.component';
// import { SelectImages } from '../read/select-images/select-images.component';
// import { IdentifyLetter } from '../read/identify-letter/identify-letter.component';
import { MenuData } from '../interfaces/menu-data';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  apiUrl: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private getToken: GetTokenService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data');

  }


  sendMenuData = (obj: MenuData) => {

    const token = this.getToken.getToken();
    const url   = urljoin(this.apiUrl, `menu${token}`);
    const body  = JSON.stringify(obj);

    return this.http.post(url, body, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );

  }


  sendTargetData = (obj: Object) => {
    const token = this.getToken.getToken();
    const url   = urljoin(this.apiUrl, `target${token}`);
    const data  = JSON.stringify(obj);

    return this.http.post(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  sendGameData = (obj: object) => {
    const token = this.getToken.getToken();
    const url   = urljoin(this.apiUrl, `game${token}`);
    const body  = JSON.stringify(obj);

    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }


  sendGuessLetterData = (obj: object) => {
    const token = this.getToken.getToken();
    const url   = urljoin(this.apiUrl, `guess-letter${token}`);
    const data  = JSON.stringify(obj);

    return this.http.post(url, data, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }


  sendDrawLetterData = (obj: DrawLetterData[]) => {
    const token = this.getToken.getToken();
    const url   = urljoin(this.apiUrl, `draw-letter${token}`);
    const data  = JSON.stringify(obj);

    return this.http.post(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  // sendCompleteWordData = (obj: CompleteWordData) => {

  //   const token = this.getToken.getToken();

  //   const url = urljoin(this.apiUrl, `complete-word${token}`);
  //   const data = JSON.stringify(obj);

  //   return this.http.post(url, data, this.httpOptions)
  //   .pipe( catchError(this.handleError) );

  // }

  // sendFindLetterData = (obj: FindLetter[]) => {

  //   const token = this.getToken.getToken();

  //   const url = urljoin(this.apiUrl, `find-letter${token}`);
  //   const data = JSON.stringify(obj);

  //   return this.http.post(url, data, this.httpOptions)
  //   .pipe( catchError(this.handleError) );

  // }

  // sendSelectWordsData = (obj: SelectWords[]) => {

  //   const token = this.getToken.getToken();

  //   const url = urljoin(this.apiUrl, `select-words${token}`);
  //   const data = JSON.stringify(obj);

  //   return this.http.post(url, data, this.httpOptions)
  //   .pipe( catchError(this.handleError) );

  // }

  // sendSelectImagesData = (obj: SelectImages) => {

  //   const token = this.getToken.getToken();
  //   const url   = urljoin(this.apiUrl, `select-images${token}`);
  //   const data  = JSON.stringify(obj);

  //   return this.http.post(url, data, this.httpOptions)
  //   .pipe( catchError(this.handleError) );

  // }

  // sendIdentifyLetterData = (obj: IdentifyLetter[]) => {

  //   const token = this.getToken.getToken();
  //   const url   = urljoin(this.apiUrl, `identify-letter${token}`);
  //   const data  = JSON.stringify(obj);

  //   return this.http.post(url, data, this.httpOptions)
  //   .pipe( catchError(this.handleError) );

  // }


  private handleError (error: HttpErrorResponse) {

    const msg = `Error Status Code: ${error.status}. \n Message: ${error.error.message} \n Error: ${error.error.error}`;
    console.error(msg);

    return throwError('Algo salió mal. Por favor, vuelve a intentarlo');

  }


}
