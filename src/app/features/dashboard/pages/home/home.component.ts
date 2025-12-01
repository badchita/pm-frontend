import { Component } from '@angular/core';
import { DashboardActiveProjectsComponent } from '../../components/dashboard-active-projects/dashboard-active-projects.component';
import { DashboardUpcomingDeadlinesComponent } from '../../components/dashboard-upcoming-deadlines/dashboard-upcoming-deadlines.component';
import { DashboardTaskCompletedComponent } from '../../components/dashboard-task-completed/dashboard-task-completed.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { DashboardQuickAccessComponent } from '../../components/dashboard-quick-access/dashboard-quick-access.component';

@Component({
  selector: 'app-home',
  imports: [
    DashboardActiveProjectsComponent,
    DashboardUpcomingDeadlinesComponent,
    DashboardTaskCompletedComponent,
    NzButtonComponent,
    DashboardQuickAccessComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
