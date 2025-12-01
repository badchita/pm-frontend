import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard-active-projects',
  imports: [NzCardModule, BaseChartDirective],
  templateUrl: './dashboard-active-projects.component.html',
  styleUrl: './dashboard-active-projects.component.scss',
})
export class DashboardActiveProjectsComponent {
  chartData = {
    labels: ['Angular', 'Vue', 'Reactjs'],
    datasets: [
      {
        axis: 'y',
        data: [90, 85, 45],
        fill: false,
        backgroundColor: ['rgba(132, 11, 220, 1)'],
      },
    ],
  };
}
