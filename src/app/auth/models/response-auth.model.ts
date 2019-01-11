import { Course } from '../../store/models/courses-state.model';

export interface ResponseAuth {
  auth:    Auth;
  courses: Course[];
}

export interface Auth {
  token:     string;
  message:   string;
  userId:    string;
  firstName: string;
  lastName:  string;
  email:     string;
  avatar:    string;
}
