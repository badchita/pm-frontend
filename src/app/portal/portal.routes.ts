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
          import('@app/features/dashboard/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('@app/features/projects/project-list/project-list.component').then(
            (m) => m.ProjectListComponent
          ),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('@app/features/projects/edit-project/edit-project.component').then(
            (m) => m.EditProjectComponent
          ),
      },
    ],
  },
];
