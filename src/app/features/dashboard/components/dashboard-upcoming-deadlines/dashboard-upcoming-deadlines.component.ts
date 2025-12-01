import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-dashboard-upcoming-deadlines',
  imports: [NzCardModule],
  templateUrl: './dashboard-upcoming-deadlines.component.html',
  styleUrl: './dashboard-upcoming-deadlines.component.scss',
})
export class DashboardUpcomingDeadlinesComponent {}
