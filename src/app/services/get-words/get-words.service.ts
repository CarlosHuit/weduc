import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import urljoin from 'url-join';
import { Injectable           } from '@angular/core';
import { environment          } from '../../../environments/environment';
import { GetTokenService      } from '../get-token.service';
import { LocalStorageService  } from '../local-storage.service';
import { Observable, of       } from 'rxjs';
import { RandomWords          } from '../../classes/random-words';
import { catchError           } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetWordsService {

  apiUrl:      string;
  httpOptions: any;

  constructor(
    private http:     HttpClient,
    private getToken: GetTokenService,
    private _storage: LocalStorageService
  ) {

    this.apiUrl = urljoin(environment.apiUrl);

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `${this.getToken.addToken()}`
      }),
      observe: 'response'
    };
  }




  getRandomWords = (letter: string): Observable<HttpResponse<RandomWords> | RandomWords | any> => {

    const token = this.getToken.getToken();
    const url   = urljoin(this.apiUrl, `words/random/${letter}`);

    return this.http.get<RandomWords>(url, this.httpOptions)
      .pipe(

        catchError(this.handleError('RandomWords', []))

      );

  }


  getAndMessUpWordsFromStorage = (letter: string): RandomWords => {

    const words         = this._storage.getElement('words');
    const wordsOfLetter = this._storage.getElement(`${letter}_w`);

    const t         = this.cleanWords(words, letter.toLowerCase());
    const lowerCase = this.prepareData(wordsOfLetter, t, 'lowerCase');
    const upperCase = this.prepareData(wordsOfLetter, t, 'upperCase');

    return {
      lowerCase: lowerCase,
      upperCase: upperCase
    };

  }







  cleanWords = (words, coincidence) =>  {

    const l = [];

    words.forEach(x => {

      const word       = x.split('');
      let coincidences = 0;

      for (let m = 0; m < word.length; m++) {
        const letter = word[m];

        if ( letter === coincidence ) {
          coincidences ++;
          break;
        }

      }

      const addCount = coincidences === 0 ? l.push(x) : false;

    });

    return l;

  }

  prepareData = (allWords, cleanWords, type) => {


    const randomNumberOfCorrectWords   = this.randomInt(2, 6, allWords.length);
    const randomNumberOfIncorrectWords = 10 - randomNumberOfCorrectWords;
    const correctWords1   = this.generateRandomWords(randomNumberOfCorrectWords, allWords);
    const incorrectWords1 = this.generateRandomWords(randomNumberOfIncorrectWords, cleanWords);


    const randomWords    = [];
    const correctWords   = [];
    const incorrectWords = [];


    if (type === 'lowerCase') {

      correctWords1.forEach(w => {
        randomWords.push(w.toLowerCase());
        correctWords.push(w.toLowerCase());
      });

      incorrectWords1.forEach(w => {
        randomWords.push(w.toLowerCase());
        incorrectWords.push(w.toLowerCase());
      });

    }

    if (type === 'upperCase') {

      correctWords1.forEach(w => {
        randomWords.push(w.toUpperCase());
        correctWords.push(w.toUpperCase());
      });

      incorrectWords1.forEach(w => {
        randomWords.push(w.toUpperCase());
        incorrectWords.push(w.toUpperCase());
      });
    }

    const mx = this.messUpWords(randomWords);

    return {
      corrects: correctWords,
      incorrects: incorrectWords,
      words: mx
    };

  }

  generateRandomWords = (max, words) => {

    const usedIndexes = [];
    const f = [];
    let count = 0;

    while (count < max) {

      const numberRandom = this.randomInt(0, words.length - 1);
      const verifyIndex  = usedIndexes.indexOf(numberRandom);

      if (verifyIndex === -1) {

        usedIndexes.push(numberRandom);
        f.push(words[numberRandom]);
        count++;

      }

    }

    return f;

  }

  messUpWords = (words) => {

    let messy = [];

    while (true) {

      if (!words.length) { break; }

      const extraction = words.shift();
      const random     = Math.floor(Math.random() * (messy.length + 1));
      const start      = messy.slice(0, random);
      const medium     = extraction;
      const end        = messy.slice(random, messy.length);

      messy = (start).concat(medium).concat(end);

    }

    return messy;

  }

  randomInt = (min, maxi, length?) => {
    const max = maxi > length ? length + 1 : maxi + 1;
    return Math.floor(Math.random() * (max - min)) + min;
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
