import { HttpClient } from '@angular/common/http';
import { Injectable         } from '@angular/core';
import { environment        } from '../../../environments/environment';
import { catchError         } from 'rxjs/operators';
import { FindLetterData     } from '../../classes/find-letter-data';
import { HandleErrorService } from '../../shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class SdFindLettersService {

  apiUrl:      string;

  constructor(
    private http:     HttpClient,
    private _err:     HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/find-letters');

  }

  sendDrawLetters = (userData: FindLetterData) => {

    const data = JSON.stringify(userData);

    return this.http.post(this.apiUrl, data)
      .pipe(
        catchError(this._err.handleError)
      );

  }



}
