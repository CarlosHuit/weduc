import { Injectable } from '@angular/core';
import { MenuLettersData } from '../../classes/menu-letters-data';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import urljoin from 'url-join';
import { environment      } from '../../../environments/environment';
import { GetTokenService  } from '../get-token.service';
import { catchError, map  } from 'rxjs/operators';
import { throwError       } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SdLettersMenuService {

  apiUrl:      string;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private getToken: GetTokenService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'data');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `${this.getToken.addToken()}`
      })
    };
  }

  send = (userData: MenuLettersData) => {

    const data = JSON.stringify(userData);
    const url  = urljoin(this.apiUrl, `letters-menu`);

    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization': `${this.getToken.addToken()}` })
    };

    return this.http.post(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError (error: HttpErrorResponse) {
    // console.log(error);
    // const msg = `Error Status Code: ${error.status}. \n Message: ${error.error.message} \n Error: ${error.error.error}`;
    // return throwError('Algo salió mal. Por favor, vuelve a intentarlo');
    return throwError(error.error.message);
  }

}



