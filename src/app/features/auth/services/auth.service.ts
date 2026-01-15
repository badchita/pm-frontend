import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { LoginForm, LoginResponse } from '@app/features/auth/models/auth.model';
import { User } from '@app/features/auth/models/user.model';
import { UserRole } from '@app/shared/enums/user-role.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.url}/auth`;

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.api}/register`, user);
  }

  login(loginForm: LoginForm): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, loginForm);
  }

  setAccessToken(token: string) {
    sessionStorage.setItem('access_token', token);
  }

  setUserDetails(user: User) {
    sessionStorage.setItem('user_details', JSON.stringify(user));
  }

  setUserRole(role: UserRole) {
    sessionStorage.setItem('user_role', JSON.stringify(role));
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  currentUser(): User | null {
    const userSession = sessionStorage.getItem('user_details');
    return userSession ? JSON.parse(userSession) : null;
  }
}
