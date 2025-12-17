import { User } from '../../features/auth/models/user.model';

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
