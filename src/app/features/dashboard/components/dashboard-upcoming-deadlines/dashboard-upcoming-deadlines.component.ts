import { Component, input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { UpcomingProject } from '../../models/dashboard.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-upcoming-deadlines',
  imports: [NzCardModule, DatePipe],
  templateUrl: './dashboard-upcoming-deadlines.component.html',
  styleUrl: './dashboard-upcoming-deadlines.component.scss',
})
export class DashboardUpcomingDeadlinesComponent {
  upcomingProjectsDeadline = input.required<UpcomingProject[]>();
}
