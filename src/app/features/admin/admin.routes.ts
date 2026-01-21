import { Routes } from '@angular/router';
import { AdminComponent } from '@app/features/admin/admin.component';
import { AuthorizedGuard } from '@app/features/auth/guards/authorized.guard';
import { permissionGuard } from '@app/features/auth/guards/permission.guard';
import { Permission } from '../auth/enums/permission.enum';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivateChild: [AuthorizedGuard, permissionGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        data: { permission: Permission.VIEW_ADMIN_PAGE },
        loadComponent: () =>
          import('@app/features/admin/admin-users/pages/admin-user-list/admin-user-list.component').then(
            (m) => m.AdminUserListComponent,
          ),
      },
      {
        path: 'users/:id',
        data: { permission: Permission.VIEW_ADMIN_PAGE },
        loadComponent: () =>
          import('@app/features/admin/admin-users/pages/admin-edit-user/admin-edit-user.component').then(
            (m) => m.AdminEditUserComponent,
          ),
      },
      {
        path: 'companies',
        data: { permission: Permission.VIEW_ADMIN_PAGE },
        loadComponent: () =>
          import('@app/features/admin/admin-companies/pages/admin-company-list/admin-company-list.component').then(
            (m) => m.AdminCompanyListComponent,
          ),
      },
      {
        path: 'companies/:id',
        data: { permission: Permission.VIEW_ADMIN_PAGE },
        loadComponent: () =>
          import('@app/features/admin/admin-companies/pages/admin-edit-company/admin-edit-company.component').then(
            (m) => m.AdminEditCompanyComponent,
          ),
      },
      {
        path: 'projects',
        data: { permission: Permission.VIEW_ADMIN_PAGE },
        loadComponent: () =>
          import('@app/features/admin/admin-projects/admin-project-list/admin-project-list.component').then(
            (m) => m.AdminProjectListComponent,
          ),
      },
      {
        path: 'not-found',
        loadComponent: () =>
          import('@app/features/errors/pages/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
      { path: '**', redirectTo: 'not-found' },
    ],
  },
];
