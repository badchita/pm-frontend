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
      {
        path: 'users/:id',
        loadComponent: () =>
          import(
            '@app/features/admin/admin-users/pages/admin-edit-user/admin-edit-user.component'
          ).then((m) => m.AdminEditUserComponent),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import(
            '@app/features/admin/admin-companies/pages/admin-company-list/admin-company-list.component'
          ).then((m) => m.AdminCompanyListComponent),
      },
      {
        path: 'companies/:id',
        loadComponent: () =>
          import(
            '@app/features/admin/admin-companies/pages/admin-edit-company/admin-edit-company.component'
          ).then((m) => m.AdminEditCompanyComponent),
      },
    ],
  },
];
