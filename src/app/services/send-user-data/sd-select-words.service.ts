import { HttpClient         } from '@angular/common/http';
import { Injectable         } from '@angular/core';
import { environment        } from '../../../environments/environment';
import { catchError         } from 'rxjs/operators';
import { SelectWordsData    } from '../../classes/select-words-data';
import { HandleErrorService } from '../../shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class SdSelectWordsService {

  apiUrl:      string;

  constructor(
    private http:     HttpClient,
    private _err: HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/select-words');

  }

  sendSelectWordsData = (userData: SelectWordsData[]) => {

    const data = JSON.stringify(userData);

    return this.http.post(this.apiUrl, data)
      .pipe(
        catchError(this._err.handleError)
      );

  }



}
