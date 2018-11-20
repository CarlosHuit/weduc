import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import urljoin from 'url-join';
import { environment      } from '../../environments/environment';
import { catchError, map  } from 'rxjs/operators';
import { throwError       } from 'rxjs';
import { DrawLetterData   } from '../interfaces/draw-letter-data';
import { GetTokenService  } from '../services/get-token.service';
import { MenuLettersData  } from '../classes/menu-letters-data';
import { LearnedLetters   } from '../interfaces/words-and-letters';
import { PronounceLetter  } from '../interfaces/pronounce-letter';
import { SelectWords      } from '../interfaces/select-words';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  apiUrl:      string;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private getToken: GetTokenService
  ) {
    this.apiUrl = urljoin(environment.apiUrl, 'data');
    this.httpOptions = {
      headers: new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };
  }

  sendUserProgress = (obj: LearnedLetters) => {


    const url   = urljoin(environment.apiUrl, `user-progress`);
    const data  = JSON.stringify(obj);

    return this.http.post(url, data, this.httpOptions)
      .pipe( catchError(this.handleError) );


  }


  sendMenuData = (obj: MenuLettersData) => {

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

  sendSelectWordsData = (obj: SelectWords[]) => {

    const token = this.getToken.getToken();

    const url = urljoin(this.apiUrl, `select-words${token}`);
    const data = JSON.stringify(obj);

    return this.http.post(url, data, this.httpOptions)
    .pipe( catchError(this.handleError) );

  }

  // sendSelectImagesData = (obj: SelectImages) => {

  //   const token = this.getToken.getToken();
  //   const url   = urljoin(this.apiUrl, `select-images${token}`);
  //   const data  = JSON.stringify(obj);

  //   return this.http.post(url, data, this.httpOptions)
  //   .pipe( catchError(this.handleError) );

  // }

  sendPronounceLetterData = (obj: PronounceLetter[]) => {

    const token = this.getToken.getToken();
    const url   = urljoin(this.apiUrl, `identify-letter${token}`);
    const data  = JSON.stringify(obj);

    return this.http.post(url, data, this.httpOptions)
    .pipe( catchError(this.handleError) );

  }


  private handleError (error: HttpErrorResponse) {
    const msg = `Error Status Code: ${error.status}. \n Message: ${error.error.message} \n Error: ${error.error.error}`;
    console.error(msg);

    return throwError('Algo salió mal. Por favor, vuelve a intentarlo');

  }


}
