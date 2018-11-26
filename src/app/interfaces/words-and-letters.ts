import { Coordinates } from './coordinates';
import { LearnedLetters } from '../classes/learned-letters';

export interface WordsAndLetters {
    words:           Words[];
    letters:         Letters;
    similarLetters:  SimilarLetters[];
    learnedLetters:  LearnedLetters[];
    coordinates:     Coordinates[];
}

export interface Letters {
    alphabet:      string;
    consonants:    string;
    vocals:        string;
    combinations:  {};
    sound_letters: {};
}

export interface Words {
    l: string;
    w: string[];
}

export interface SimilarLetters {
    l: string;
    m: string;
}


