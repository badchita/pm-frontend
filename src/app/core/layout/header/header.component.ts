import { Component, inject, OnDestroy } from '@angular/core';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [NzIconModule, NzButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnDestroy {
  private readonly authService = inject(AuthService);

  private readonly _destroying$ = new Subject<void>();

  logout() {
    this.authService
      .logout()
      .pipe(takeUntil(this._destroying$))
      .subscribe({
        next: () => {
          localStorage.clear();

          globalThis.location.href = '/login';
        },
      });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
