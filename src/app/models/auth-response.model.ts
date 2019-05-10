import { Course } from '../models/course.model';
import { User } from './user.model';

export class AuthResponse {

  constructor(
    public user: User,
    public token: string,
    public courses: Course[],
    public message: string,
  ) {}

}
