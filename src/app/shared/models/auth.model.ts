import { User } from './user.model';

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
