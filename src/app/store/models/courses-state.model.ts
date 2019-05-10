export class CoursesStateModel {
  constructor(
    public courses:          Course[],
    public selectedCourse:   Course,
    public isLoadingCourses: boolean,
  ) {}
}

export class Course {

  constructor(
    public id:          string,
    public title:       string,
    public subtitle:    string,
    public imageUrl:    string,
    public urlVideo:    string,
    public description: string,
  ) { }

}
