import { HttpClient              } from '@angular/common/http';
import { Injectable              } from '@angular/core';
import { environment             } from '../../../environments/environment';
import { Observable, of          } from 'rxjs';
import { catchError, map         } from 'rxjs/operators';
import { LocalStorageService     } from '../local-storage.service';
import { Coordinates             } from '../../classes/coordinates';
import { HandleErrorService      } from '../../shared/handle-error.service';
import urljoin from 'url-join';




@Injectable({
  providedIn: 'root'
})
export class GetCoordinatesService {

  apiUrl: string;

  constructor(
    private http:     HttpClient,
    private _storage: LocalStorageService,
    private _error:   HandleErrorService
  ) {
    this.apiUrl = urljoin(environment.apiUrl, 'coordinates');
  }

  getCoordinates = (letter: string): Observable<any | Coordinates> => {
    const val1 = this._storage.getElement(`${letter.toLowerCase()}_coo`);
    const val2 = this._storage.getElement(`${letter.toUpperCase()}_coo`);

    if (!Storage || val1 === null || val2 === null) {

      return this.getCoordinatesFromServer(letter);

    }

    if ( Storage && val1 !== null && val2 !== null) {

      return of(this.getCoordinatesFromStorage(letter));

    }
  }


  getCoordinatesFromServer = (letter: string): Observable<any | Coordinates> => {

    const url = urljoin(this.apiUrl, letter);

    return this.http.get<Coordinates>(url)
      .pipe(
        map(x => this.saveData(x, letter)),
        catchError(this._error.handleError)
      );
  }

  saveData = (x, letter) => {

    if (Storage) {
      const upper = x.coordinates[letter.toUpperCase()];
      const lower = x.coordinates[letter.toLowerCase()];

      this._storage.saveElement(`${letter.toUpperCase()}_coo`, upper);
      this._storage.saveElement(`${letter.toLowerCase()}_coo`, lower);
    }

    return x;

  }

  getCoordinatesFromStorage = (letter: string) => {
    const lowerCase = letter.toLowerCase();
    const upperCase = letter.toUpperCase();
    const CoordinatesLowerCase = this._storage.getElement(`${lowerCase}_coo`);
    const CoordinatesUpperCase = this._storage.getElement(`${upperCase}_coo`);

    const coordinates = {};
    coordinates[lowerCase] = CoordinatesLowerCase;
    coordinates[upperCase] = CoordinatesUpperCase;

    return { letter: letter.toLowerCase(), coordinates: coordinates };
  }



  saveCoordinnates = (coordinates: Coordinates) => {

    const url = urljoin(this.apiUrl, 'guardar');
    const coo = JSON.stringify(coordinates);

    return this.http.post(url, coo)
      .pipe(
        catchError(this._error.handleError)
      );

  }


}
