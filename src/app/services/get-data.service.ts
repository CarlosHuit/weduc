import { Injectable } from '@angular/core';
import urljoin from 'url-join';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { GetTokenService } from './get-token.service';
import { LocalStorageService } from './local-storage.service';

import { WordsAndLetters, Letters, Words  } from '../interfaces/words-and-letters';



export interface SimilarLetters {
  letter:         string;
  similarLetters: string[];
}

export interface RandomSimilarLetters {
  upperCase: string[];
  lowerCase: string[];
}

export interface Syllables {
  letter:    string;
  syllables: string[];
}

export interface RandomWords {
  lowerCase: RandomWordsOPtion;
  upperCase: RandomWordsOPtion;
}

export interface RandomWordsOPtion {
  corrects?:   string[];
  incorrects?: string[];
  words?:      string[];
}


/* ------------ */
export interface Combinations {
  letter: string;
  combinations: Options[];
}

export interface Options {
  word:        string;
  combination: string;
  syllables:   string[];
  syllable:    SyllableDetail;
  color?:      string;
}

export interface SyllableDetail {
  w: string;
  p: string;
}

@Injectable({ providedIn: 'root' })

export class GetDataService {


  apiUrl: string;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private getToken: GetTokenService,
    private _storage: LocalStorageService
    ) {

    this.apiUrl = urljoin(environment.apiUrl);
    this.httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': `${this.getToken.addToken()}`
        }
      )
    };

  }



  getLetters(): Observable<any | Letters> {

    const url = urljoin(this.apiUrl, 'letters');

    return this.http.get<Letters>(url)
      .pipe(

        catchError(this.handleError('getLetters', []))

      );
  }



  getAllWords(): Observable<Words[]> {

    const url = urljoin(this.apiUrl, 'words');

    return this.http.get<Words[]>(url)
      .pipe(

        catchError(this.handleError('getAllLetters', []))

        );
  }



  getWords(id: string): Observable<any | Words> {

    const url = urljoin(this.apiUrl, `words/${id}`);

    return this.http.get<Words>(url)
      .pipe(

        catchError(this.handleError('getWords', []))

      );
  }



  getSimilarLetters(letter: string): Observable<any | SimilarLetters[]> {

    const url = urljoin(this.apiUrl, `similar-letters/${letter}`);

    return this.http.get(url)
      .pipe(

        catchError(this.handleError('SimilarLetters', []))

      );
  }
  getRandomSimilarLetters(letter: string): Observable<any | HttpResponse<RandomSimilarLetters>> {

    const url = urljoin(this.apiUrl, `similar-letters/random/${letter}`);

    return this.http.get<RandomSimilarLetters>(url, {observe: 'response'})
      .pipe(

        catchError(this.handleError('SimilarLetters', []))

      );
  }



  getAllSyllables(): Observable<Syllables[]> {

    const url = urljoin(this.apiUrl, 'syllables');

    return this.http.get<Syllables[]>(url)
      .pipe(

        catchError(this.handleError('AllSyllables', []))

      );
  }



  getSyllables(letter: string): Observable<any | Syllables> {

    const url = urljoin(this.apiUrl, `syllables/${letter}`);

    return this.http.get<Syllables>(url)
      .pipe(

        catchError( this.handleError('OneSyllable', []) )

      );
  }


  getSoundLetters = () => {

    const url = urljoin(this.apiUrl, 'sound-letters');

    return this.http.get(url)
      .pipe(

        catchError( this.handleError('SoundLetters', []) )

      );

  }


  getWordsAndLetters = (): Observable<any | WordsAndLetters> => {

    const token = this.getToken.getToken();
    const url   = urljoin(this.apiUrl, `words-and-letters`);

    return this.http.get(url, this.httpOptions)
      .pipe(
        map(x => {
          this.saveData(x);
          return x;
        }),
        catchError(this.handleError('WordsAndLetters', []))
      );

  }

  saveData = (x) => {
    console.log(x.words);
    // const data = x as WordsAndLetters;


    const words          = x.words;
    const letters        = x.letters;
    const similarLetters = x.similarLetters;
    const learnedLetters = x.learnedLetters;
    const coordinates    = x.coordinates;
    /* Se selecciona la imagen */

    if (Storage) {

      localStorage.setItem('alphabet',        JSON.stringify(letters.alphabet)     );
      localStorage.setItem('consonants',      JSON.stringify(letters.consonants)   );
      localStorage.setItem('vocals',          JSON.stringify(letters.vocals)       );
      localStorage.setItem('combinations',    JSON.stringify(letters.combinations) );
      localStorage.setItem('letter_sounds',   JSON.stringify(letters.sound_letters));
      localStorage.setItem('learned_letters', JSON.stringify(learnedLetters));

      localStorage.setItem('coordinates',     JSON.stringify(coordinates));
      coordinates.forEach(c => this._storage.saveElement(`${c.letter}_coo`, c.coordinates ));

      // a list of words is saved for each letter
      words.forEach(el => localStorage.setItem(`${el.l}_w`, JSON.stringify(el.w)));

      letters.alphabet.split('').forEach(letter => {
        const d = {};
        d[letter.toLowerCase()] = similarLetters.find(e => e.l === letter.toLowerCase()).m;
        d[letter.toUpperCase()] = similarLetters.find(e => e.l === letter.toUpperCase()).m;

        localStorage.setItem(`${letter}_sl`, JSON.stringify(d));
      });
    }


  }

  getRandomWords = (letter: string): Observable<HttpResponse<RandomWords> | RandomWords | any> => {

    const url = urljoin(this.apiUrl, `words/random/${letter}`);

    return this.http.get<RandomWords>(url,  { observe: 'response' })
      .pipe(

        catchError(this.handleError('RandomWords', []))

      );

  }

  getRandomWorsdForUrls = (letter: string): Observable<HttpResponse<RandomWordsOPtion> | RandomWordsOPtion | any> => {

    const url = urljoin(this.apiUrl, `words/random-name-img/${letter}`);

    return this.http.get<RandomWordsOPtion>(url, { observe: 'response' })
      .pipe(

        catchError(this.handleError('RandomWordsOPtion', []))

      );

  }

  getCombinations = (letter: string): Observable<HttpResponse<Combinations> | Combinations | any> => {

    const url = urljoin(this.apiUrl, `combinations/${letter}`);

    return this.http.get<Combinations>(url, { observe: 'response' })
      .pipe(
        catchError(this.handleError('RandomWordsOPtion', []))
      );

  }


  public handleError<T>(operation = 'operation', result?: T) {

    return (error: any): Observable<T> => {

      console.error(error.error.error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);

    };
  }

  private log(message: string) {
    console.log(message);
  }

}
