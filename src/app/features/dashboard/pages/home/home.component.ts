import { Component } from '@angular/core';
import { DashboardActiveProjectsComponent } from '../../components/dashboard-active-projects/dashboard-active-projects.component';
import { DashboardUpcomingDeadlinesComponent } from '../../components/dashboard-upcoming-deadlines/dashboard-upcoming-deadlines.component';

@Component({
  selector: 'app-home',
  imports: [DashboardActiveProjectsComponent, DashboardUpcomingDeadlinesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
