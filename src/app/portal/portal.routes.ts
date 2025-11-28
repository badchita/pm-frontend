import { Routes } from '@angular/router';
import { PortalComponent } from './portal.component';

export const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@app/features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
    ],
  },
];
