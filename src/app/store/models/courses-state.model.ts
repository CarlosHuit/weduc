export class CoursesStateModel {
  constructor(
    public courses:          Course[],
    public isLoadingCourses: boolean,
  ) {}
}

export class Course {
  constructor(
    public _id:         string,
    public title:       string,
    public subtitle:    string,
    public imageUrl:    string,
    public urlVideo:    string,
    public description: string,
  ) {}
}



