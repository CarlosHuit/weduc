import { Letters, LetterSound, AlphabetCombination } from 'src/app/models/reading-course/letters.model';
import { Word } from 'src/app/models/reading-course/word.model';
import { SimilarLetter } from 'src/app/models/reading-course/similar-letter.model';
import { Coordinate } from 'src/app/models/reading-course/coordinate.model';
import { ItemLetterMenu } from 'src/app/models/reading-course/item-letter-menu.model';
import { LearnedLetter } from 'src/app/models/reading-course/learned-letter.model';

export class ReadingCourseDataModel {

  constructor(
    public words:          Word[],
    public learnedLetters: LearnedLetter[],
    public isLoadingData:  boolean,
    public lettersMenu:    ItemLetterMenu[],
    public combinations:   AlphabetCombination[],
    public letterSounds:   LetterSound[],
    public similarLetters: SimilarLetter[],
    public coordinates:    Coordinate[],
    public currentLetter:  string,
    public alphabet:       string,
    public vocals:         string,
    public consonants:     string,
  ) {}

}
