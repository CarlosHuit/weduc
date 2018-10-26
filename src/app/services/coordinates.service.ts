import { Injectable } from '@angular/core';
import urljoin from 'url-join';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Coordinates {
  _id?: string;
  letter: string;
  coordinates: {};
}



@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = urljoin(environment.apiUrl, 'coordinates');
  }



  getCoordinates = (letter: string): Observable<Coordinates> => {

    const url = urljoin(this.apiUrl, letter);

    return this.http.get<Coordinates>(url)
      .pipe(
        catchError(this.handleError)
      );
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



  private handleError(error: HttpErrorResponse) {

    console.clear();

    if (error.error instanceof ErrorEvent) {
      console.error('Error', error.error.message);
    } else {
      const msg = `Error Status Code: ${error.status}. \n Error Message: ${error.error.error}`;
      console.error(msg);
    }
    return throwError('Algo salió mal. Por favor, vuelve a intentarlo');
  }

}
