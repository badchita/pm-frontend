import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { LoginForm, LoginResponse } from '@app/features/auth/models/auth.model';
import { User } from '@app/features/auth/models/user.model';
import { UserRole } from '@app/shared/enums/user-role.enum';
import { finalize, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.url}/auth`;

  private refreshTokenInProgress$?: Observable<{ token: string; refreshToken: string }>;

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.api}/register`, user);
  }

  login(loginForm: LoginForm): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, loginForm);
  }

  refreshToken(refreshToken: string): Observable<{ token: string; refreshToken: string }> {
    if (this.refreshTokenInProgress$) {
      return this.refreshTokenInProgress$;
    }

    this.refreshTokenInProgress$ = this.http
      .post<{ token: string; refreshToken: string }>(`${this.api}/refresh-token`, { refreshToken })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.token);
          localStorage.setItem('refresh_token', res.refreshToken);
        }),
        finalize(() => {
          this.refreshTokenInProgress$ = undefined;
        }),
      );

    return this.refreshTokenInProgress$;
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.api}/logout`, {});
  }

  setAccessToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  setUserDetails(user: User) {
    localStorage.setItem('user_details', JSON.stringify(user));
  }

  setUserRole(role: UserRole) {
    localStorage.setItem('user_role', JSON.stringify(role));
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  currentUser(): User | null {
    const userLocalStorage = localStorage.getItem('user_details');
    return userLocalStorage ? JSON.parse(userLocalStorage) : null;
  }
}
