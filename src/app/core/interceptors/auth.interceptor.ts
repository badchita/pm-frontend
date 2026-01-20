import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@app/features/auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private isRefreshing = false;

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('access_token');

    const authReq = token
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
              return this.authService.refreshToken(refreshToken).pipe(
                switchMap((res) => {
                  this.isRefreshing = false;
                  localStorage.setItem('access_token', res.token);
                  localStorage.setItem('refresh_token', res.refreshToken);

                  const retryReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${res.token}` },
                  });
                  return next.handle(retryReq);
                }),
                catchError((err) => {
                  this.isRefreshing = false;
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  return throwError(() => err);
                })
              );
            } else {
              localStorage.removeItem('access_token');
              return throwError(() => error);
            }
          }
        }

        return throwError(() => error);
      })
    );
  }
}
