import { HttpClient         } from '@angular/common/http';
import { Injectable         } from '@angular/core';
import { MenuLettersData    } from '../../classes/menu-letters-data';
import { environment        } from '../../../environments/environment';
import { catchError,        } from 'rxjs/operators';
import { HandleErrorService } from '../../shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})
export class SdLettersMenuService {

  apiUrl:      string;

  constructor(
    private http:     HttpClient,
    private _err: HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data');

  }

  send = (userData: MenuLettersData) => {

    const data = JSON.stringify(userData);
    const url  = urljoin(this.apiUrl, `letters-menu`);


    return this.http.post(url, data)
      .pipe(
        catchError(this._err.handleError)
      );
  }


}



