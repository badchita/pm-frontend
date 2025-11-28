import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'portal',
    loadChildren: () => import('@app/portal/portal.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@app/features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@app/features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
