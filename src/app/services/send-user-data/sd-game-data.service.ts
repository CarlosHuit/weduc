import { Injectable  } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError  } from 'rxjs/operators';
import { GameData    } from '../../classes/game-data';
import { HandleErrorService } from '../../shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})
  export class SdGameDataService {

  apiUrl:      string;

  constructor(
    private http: HttpClient,
    private _err: HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data/game');

  }

  sendGameData = (userData: GameData[]) => {

    const data = JSON.stringify(userData);


    return this.http.post(this.apiUrl, data)
      .pipe(
        catchError(this._err.handleError)
      );

  }

}
