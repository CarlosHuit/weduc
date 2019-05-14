import { HttpClient              } from '@angular/common/http';
import { Injectable              } from '@angular/core';
import { environment             } from '../../../environments/environment';
import { Observable, of          } from 'rxjs';
import { catchError, map         } from 'rxjs/operators';
import { RandomWords             } from '../../classes/random-words';
import { LocalStorageService     } from '../local-storage.service';
import { HandleErrorService      } from '../../shared/handle-error.service';
import urljoin from 'url-join';
import { Word } from 'src/app/models/reading-course/word.model';




@Injectable({ providedIn: 'root' })

export class GetWordsService {


  apiUrl:   string;

  constructor(
    private http:     HttpClient,
    private _storage: LocalStorageService,
    private _err:     HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'words');

  }

  getWordsOfLetter = (letter: string): Observable<any | Word> => {

    const words = this._storage.getElement(`${letter}_w`);

    if ( !Storage || words === null ) {
      return this.getWordsOfLetterFromServer(letter);
    }

    if (Storage && words !== null) {
      return this.getWordsOfLetterFromStorage(letter);
    }

  }

  getWordsOfLetterFromServer = (letter: string): Observable<any | Word> => {

    const url = urljoin(this.apiUrl, letter);

    return this.http.get<Word>(url)
      .pipe(
        map(x => this.saveData(x)),
        catchError(this._err.handleError)
      );

  }

  saveData = (data) => {

    if (Storage) {

      const d = data as Word;
      const letter = d.letter;
      const words  = d.words;
      this._storage.saveElement(`${letter.toLowerCase()}_w`, words);

    }
    return data;
  }

  getWordsOfLetterFromStorage = (letter: string): Observable<any | Word> => {
    const words = this._storage.getElement(`${letter}_w`);
    return of (new Word(letter, words));
  }


  /*------ getRandomWords of Storage || Server ------*/
  getRandomWords = (letter: string): Observable<RandomWords | any> => {

    const x = this._storage.getElement('words');
    const y = this._storage.getElement(`${letter}_w`);

    const dataOfStorage = !Storage || x === null || y === null ? false : true;

    if (  dataOfStorage ) { return this.getAndMessUpWordsFromStorage(letter); }
    if ( !dataOfStorage ) { return this.getRandomWordsOfServer(letter); }

  }


/* Get RandomWords Of Server And save on the localStorage */
  getRandomWordsOfServer = (letter: string): Observable<RandomWords | any> => {

    const url = urljoin(this.apiUrl, `/random/${letter}`);

    return this.http.get<RandomWords>(url)
      .pipe(
        map( x => this.saveAllWords(x) ),
        catchError(this._err.handleError)

      );

  }

  saveAllWords = (x) => {
    if (Storage) {
      const data = x as RandomWords;
      this._storage.saveElement('words', data.words);
    }

    return x;
  }




  /* get RandomWprds of Storage  */
  getAndMessUpWordsFromStorage = (letter: string): Observable<RandomWords> => {

    const words         = this._storage.getElement('words');
    const wordsOfLetter = this._storage.getElement(`${letter}_w`);

    const t         = this.cleanWords(words, letter.toLowerCase());
    const lowerCase = this.prepareData(wordsOfLetter, t, 'lowerCase');
    const upperCase = this.prepareData(wordsOfLetter, t, 'upperCase');

    return of ({ lowerCase, upperCase });

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

  randomInt = (min: number, maxi: number, length?: number) => {

    const max = maxi > length ? length + 1 : maxi + 1;
    return Math.floor(Math.random() * (max - min)) + min;

  }




}
