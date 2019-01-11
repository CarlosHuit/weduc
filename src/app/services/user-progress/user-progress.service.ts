import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable          } from '@angular/core';
import { environment         } from '../../../environments/environment';
import { GetTokenService     } from '../get-token.service';
import { catchError          } from 'rxjs/operators';
import { Observable, of      } from 'rxjs';
import { LearnedLetters      } from '../../classes/learned-letters';
import { LocalStorageService } from '../local-storage.service';
import { UserProgress        } from '../../classes/user-progress';
import { HandleErrorService  } from '../../shared/handle-error.service';
import urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})

export class UserProgressService {

  apiUrl:      string;

  constructor(
    private http:     HttpClient,
    private _storage: LocalStorageService,
    private _err:     HandleErrorService
  ) {

    this.apiUrl = urljoin(environment.apiUrl, 'user-progress');

  }

  sendUserProgress = (obj: LearnedLetters) => {


    const url   = this.apiUrl;
    const data  = JSON.stringify(obj);

    return this.http.post(url, data)
      .pipe( catchError(this._err.handleError) );

  }

  getUserProgress = (id: string): Observable< LearnedLetters[] | any > => {

    const url = urljoin(this.apiUrl, id);

    return this.http.get<LearnedLetters[]>(url)
      .pipe(
        catchError(this._err.handleError)
      );

  }

  saveUserProgress = (obj: LearnedLetters) => {
    const connection = navigator.onLine ? true : false;


    if ( connection  ) { return this.sendUserProgress(obj);          }
    if ( !connection ) { return this.saveUserProgressOnStorage(obj); }

  }



  saveUserProgressOnStorage = (obj: LearnedLetters) => {

    const id = this._storage.getElement('user')['userId'];
    const { letter, rating } = obj;
    const alphabet   = this._storage.getElement('alphabet');
    const maxRating  = 5;
    const validation = this.validateLetterAndRating(alphabet, maxRating, obj.letter, obj.rating);


    if ( validation ) {

      const userProgressProfile: UserProgress = this._storage.getElement('user_progress');


      if (userProgressProfile) {



        const lLetters    = userProgressProfile.learnedLetters.slice();
        const letterExist = lLetters.find( group => group.letter === letter );



        if (letterExist)  {



          if (letterExist.rating >= rating) {
            const msg = 'La letra no se actualiza, por que el rating es menor';
          }



          if (letterExist.rating < rating) {


            const updateData = lLetters.slice();
            updateData.forEach(el => el.letter === letter ? el.rating = rating : null );

            const dataUpdated     = new UserProgress(id, updateData);
            const saveDataUpdated = this._storage.saveElement('user_progress', dataUpdated);

            const msg = `Se actulizo el ratingo de la letra: ${letter}`;

          }



        }



        if (!letterExist) {


          const newElement  = new LearnedLetters(letter, rating);
          userProgressProfile.learnedLetters.push(newElement);
          this._storage.saveElement('user_progress', userProgressProfile);

          const msg = `Se agrega al progreso la letra: ${letter}`;


        }



      }



      if (!userProgressProfile) {

        const data = new UserProgress(id, [new LearnedLetters(letter, rating)]);
        this._storage.saveElement('user_progress', data);

        const msg = 'Se crea un nuevo perfil de progreso';

      }



    } else {

      console.log('Invalid Data');

    }

    return of('saved');

  }



  validateLetterAndRating = (alphabet, maxRating, letter, rating) => {

    let valLetter;
    const valRating = rating <= maxRating ? true : false;

    alphabet.split('').forEach(l => l === letter ? valLetter = true : null );

    return  valLetter === true && valRating === true ? true : false;

  }


}
