import { Routes } from '@angular/router';
import { PortalComponent } from './portal.component';

export const PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@app/features/dashboard/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('@app/features/projects/pages/project-list/project-list.component').then(
            (m) => m.ProjectListComponent
          ),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('@app/features/projects/pages/edit-project/edit-project.component').then(
            (m) => m.EditProjectComponent
          ),
      },
      {
        path: 'tasks/:projectId/:id',
        loadComponent: () =>
          import('@app/features/tasks/pages/edit-task/edit-task.component').then(
            (m) => m.EditTaskComponent
          ),
      },
      {
        path: 'task-board/:projectId',
        loadComponent: () =>
          import('@app/features/task-board/pages/task-board-page/task-board-page.component').then(
            (m) => m.TaskBoardPageComponent
          ),
      },

      {
        path: 'admin',
        loadChildren: () => import('@app/features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
    ],
  },
];
