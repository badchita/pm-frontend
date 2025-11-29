import { Routes } from '@angular/router';
import { AuthorizedGuard } from '@app/core/guards/authorized.guard';
import { NotAuthorizedGuard } from '@app/core/guards/not-authorized.guard';

export const routes: Routes = [
  {
    path: 'portal',
    loadChildren: () => import('@app/portal/portal.routes').then((m) => m.routes),
    canActivate: [AuthorizedGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@app/features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [NotAuthorizedGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@app/features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [NotAuthorizedGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
