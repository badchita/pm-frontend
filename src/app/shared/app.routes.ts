import { Routes } from '@angular/router';
import { AuthorizedGuard } from '@app/features/auth/guards/authorized.guard';
import { NotAuthorizedGuard } from '@app/features/auth/guards/not-authorized.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'portal',
    loadChildren: () => import('@app/portal/portal.routes').then((m) => m.PORTAL_ROUTES),
    canActivate: [AuthorizedGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@app/features/auth/pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [NotAuthorizedGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@app/features/auth/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [NotAuthorizedGuard],
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('@app/features/errors/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
