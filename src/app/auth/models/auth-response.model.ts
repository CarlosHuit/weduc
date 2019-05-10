import { UserResponse } from './user-response.model';
import { Course } from '../../store/models/courses-state.model';

export class AuthResponse {

  constructor(
    public user: UserResponse,
    public token: string,
    public courses: Course[],
    public message: string,
  ) {}

}
