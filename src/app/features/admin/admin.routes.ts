import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        loadComponent: () =>
          import(
            '@app/features/admin/admin-users/pages/admin-user-list/admin-user-list.component'
          ).then((m) => m.AdminUserListComponent),
      },
    ],
  },
];
