import { UserResponse } from './user-response.model';
import { CourseResponse } from './course-response';

export class AuthResponse {

  constructor(
    public user: UserResponse,
    public token: string,
    public courses: CourseResponse[],
    public message: string,
  ) {}

}
