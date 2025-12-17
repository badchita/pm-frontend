import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@app/features/auth/services/auth.service';

export const AuthorizedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], {
      queryParams: { message: 'not-authenticated' },
    });
    return false;
  }

  return true;
};
