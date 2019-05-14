import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import urljoin from 'url-join';
import { environment } from '../../../environments/environment';
import { HandleErrorService } from '../../shared/handle-error.service';
import { LocalStorageService } from '../local-storage.service';
import { SimilarLetter } from 'src/app/models/reading-course/similar-letter.model';

@Injectable({
  providedIn: 'root'
})
export class GetSimilarLettersService {

  apiUrl:   string;

  constructor(
    private http:     HttpClient,
    private _storage: LocalStorageService,
    private _err:     HandleErrorService
    ) {
      this.apiUrl = urljoin(environment.apiUrl);
    }

  getSimilarLetters = (letter: string): Observable<any | SimilarLetter[]> => {

    const data = this._storage.getElement(`${letter}_sl`);

    if (!Storage || data === null ) { return this.getSimilarLettersOfServer(letter); }

    if (Storage && data) { return this.getSimilarLettersOfStorage(letter); }
  }




  getSimilarLettersOfStorage = (letter: string): Observable<any | SimilarLetter[]> => {

    const data = this._storage.getElement(`${letter}_sl`);
    return of(data);

  }



  getSimilarLettersOfServer (letter: string): Observable<any | SimilarLetter[]> {

    const url = urljoin(this.apiUrl, `similar-letters/${letter}`);

    return this.http.get<SimilarLetter[]>(url)
      .pipe(
        map(x => this.convertData(x, letter)),
        catchError(this._err.handleError)

      );
  }

  convertData = (data, letter: string) => {

    const x = data as SimilarLetter[];

    const upperIndex = x.findIndex(m => m.letter === letter.toUpperCase() );
    const lowerIndex = x.findIndex(w => w.letter === letter.toLowerCase() );
    const upper = x[upperIndex];
    const lower = x[lowerIndex];

    const q = {};
    q[letter.toUpperCase()] = upper.similarLetters;
    q[letter.toLowerCase()] = lower.similarLetters;

    this._storage.saveElement(`${letter.toLowerCase()}_sl`, q);

    return q;

  }


}

