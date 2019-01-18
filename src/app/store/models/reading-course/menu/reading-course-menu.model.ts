export class ReadingCourseMenu {
  constructor(
    public sortedBy  =        'alphabet' || 'rating',
    public activeTab =        'alphabet' || 'learneds',
    public selectedLetter:    string,
    public activeRedirection: boolean,
    public highlight:         { letter: string, type: string },
  ) {}
}
