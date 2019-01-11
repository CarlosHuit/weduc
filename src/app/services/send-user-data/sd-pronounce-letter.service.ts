import { HttpClient           } from '@angular/common/http';
import { Injectable           } from '@angular/core';
import { environment          } from '../../../environments/environment';
import { catchError           } from 'rxjs/operators';
import { PronounceLetterData  } from '../../classes/pronounce-letter-data';
import { HandleErrorService   } from '../../shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class SdPronounceLetterService {

  apiUrl: string;

  constructor(
    private http: HttpClient,
    private _err:     HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/pronounce-letters');

  }

  sendPronounceLettersData = (userData: PronounceLetterData[]) => {

    const data = JSON.stringify(userData);

    return this.http.post(this.apiUrl, data)
      .pipe(
        catchError(this._err.handleError)
      );

  }


}
