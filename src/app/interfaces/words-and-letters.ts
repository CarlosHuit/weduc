export interface Letters {
    alphabet: string;
    consonants: string;
    vocals: string;
    combinations: {};
    sound_letters: {};
}

export interface Words {
    letter: string;
    words: string[];
}

export interface WordsAndLetters {
    words: Words[];
    letters: Letters;
}
