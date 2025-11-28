import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { LoginForm, LoginResponse } from '@app/shared/models/auth.model';
import { User } from '@app/shared/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private api = `${environment.url}/auth`;

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
}
