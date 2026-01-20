import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly title = signal('pm-frontend');

  private readonly _destroying$ = new Subject<void>();

  ngOnInit() {
    const refreshToken = this.authService.getRefreshToken();

    if (refreshToken) {
      this.authService
        .refreshToken(refreshToken)
        .pipe(takeUntil(this._destroying$))
        .subscribe({
          next: () => {
            if (this.router.url !== '/portal') {
              this.router.navigate(['/portal']);
            }
          },
          error: () => this.authService.logout(),
        });
    }
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
