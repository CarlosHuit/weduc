import { HttpClient         } from '@angular/common/http';
import { Injectable         } from '@angular/core';
import { environment        } from '../../../environments/environment';
import { catchError         } from 'rxjs/operators';
import { LettersDetailData  } from '../../classes/letters-detail-data';
import { HandleErrorService } from 'src/app/shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
    providedIn: 'root'
  })
  export class SdLettersDetailService {

  apiUrl:      string;

  constructor(
    private http:     HttpClient,
    private _err:     HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/letters-detail');

  }

  sendLettersDetailData = (userData: LettersDetailData[]) => {

    const data = JSON.stringify(userData);

    return this.http.post(this.apiUrl, data)
      .pipe( catchError(this._err.handleError) );

  }



}
