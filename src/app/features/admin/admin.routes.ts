import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthorizedGuard } from '../auth/guards/authorized.guard';
import { permissionGuard } from '../auth/guards/permission.guard';
import { Permission } from '../auth/enums/permission.enum';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        canActivate: [AuthorizedGuard, permissionGuard],
        data: { permission: Permission.VIEW_ADMIN_PAGE },
        loadComponent: () =>
          import(
            '@app/features/admin/admin-users/pages/admin-user-list/admin-user-list.component'
          ).then((m) => m.AdminUserListComponent),
      },
      {
        path: 'users/:id',
        canActivate: [AuthorizedGuard],
        loadComponent: () =>
          import(
            '@app/features/admin/admin-users/pages/admin-edit-user/admin-edit-user.component'
          ).then((m) => m.AdminEditUserComponent),
      },
      {
        path: 'companies',
        canActivate: [AuthorizedGuard],
        loadComponent: () =>
          import(
            '@app/features/admin/admin-companies/pages/admin-company-list/admin-company-list.component'
          ).then((m) => m.AdminCompanyListComponent),
      },
      {
        path: 'companies/:id',
        canActivate: [AuthorizedGuard],
        loadComponent: () =>
          import(
            '@app/features/admin/admin-companies/pages/admin-edit-company/admin-edit-company.component'
          ).then((m) => m.AdminEditCompanyComponent),
      },
    ],
  },
];
