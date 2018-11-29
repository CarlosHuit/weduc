import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Injectable           } from '@angular/core';
import { environment          } from '../../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map        } from 'rxjs/operators';
import { GetTokenService        } from '../get-token.service';
import { LocalStorageService    } from '../local-storage.service';
import { Router                 } from '@angular/router';
import { AuthService            } from '../auth.service';
import { Coordinates            } from '../../classes/coordinates';
import urljoin from 'url-join';




@Injectable({
  providedIn: 'root'
})
export class GetCoordinatesService {

  apiUrl: string;
  httpOpts: any;

  constructor(
    private _router:  Router,
    private http:     HttpClient,
    private _auth:    AuthService,
    private getToken: GetTokenService,
    private _storage: LocalStorageService,
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
    this.httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };

    return this.http.get<Coordinates>(url, this.httpOpts)
      .pipe(
        map(x => this.saveData(x, letter)),
        catchError(this.handleError)
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

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const url = urljoin(this.apiUrl, 'guardar');
    const coo = JSON.stringify(coordinates);

    return this.http.post(url, coo, httpOptions)
      .pipe(
        catchError(this.handleError)
      );

  }



  handleError = (error: HttpErrorResponse) => {
    if (error.status === 401) {
      this._router.navigateByUrl('');
      this._auth.logout();
      this._auth.showError('Inicia sesión con un usuario válido', 2000);
      return throwError('Usuario Invalido');
    }
  }

}
