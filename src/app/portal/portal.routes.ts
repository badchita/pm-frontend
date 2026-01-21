import { Routes } from '@angular/router';
import { PortalComponent } from './portal.component';
import { AuthorizedGuard } from '@app/features/auth/guards/authorized.guard';
import { permissionGuard } from '@app/features/auth/guards/permission.guard';
import { Permission } from '@app/features/auth/enums/permission.enum';

export const PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: PortalComponent,
    canActivateChild: [AuthorizedGuard, permissionGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@app/features/dashboard/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'projects',
        data: { permission: Permission.VIEW_PROJECTS_PAGE },
        loadComponent: () =>
          import('@app/features/projects/pages/project-list/project-list.component').then(
            (m) => m.ProjectListComponent,
          ),
      },
      {
        path: 'projects/:id',
        data: { permission: Permission.VIEW_PROJECTS_PAGE },
        loadComponent: () =>
          import('@app/features/projects/pages/edit-project/edit-project.component').then(
            (m) => m.EditProjectComponent,
          ),
      },
      {
        path: 'tasks/:projectId/:id',
        data: { permission: Permission.VIEW_TASKBOARD_PAGE },
        loadComponent: () =>
          import('@app/features/tasks/pages/edit-task/edit-task.component').then(
            (m) => m.EditTaskComponent,
          ),
      },
      {
        path: 'task-board/:projectId',
        data: { permission: Permission.VIEW_TASKBOARD_PAGE },
        loadComponent: () =>
          import('@app/features/task-board/pages/task-board-page/task-board-page.component').then(
            (m) => m.TaskBoardPageComponent,
          ),
      },
      {
        path: 'admin',
        data: { permission: Permission.VIEW_ADMIN_PAGE },
        loadChildren: () => import('@app/features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
      {
        path: 'not-found',
        loadComponent: () =>
          import('@app/features/errors/pages/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('@app/features/errors/pages/forbidden/forbidden.component').then(
            (m) => m.ForbiddenComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'not-found',
      },
    ],
  },
];
