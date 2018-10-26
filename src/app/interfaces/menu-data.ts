export interface MenuData {
    user_id?:     string;
    initTime?:    string;
    date?:        string;
    selection?:   Selection[];
    successTime?: string;
}

export interface Selection {
    letter?:        string;
    openModalTime?: string;
    letterUpper?:   number;
    letterLower?:   number;
    words?:         any;
    syllables?:     any;
    cancelTime?:    string;
    successTime?:   string;
}
