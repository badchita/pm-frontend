import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard-task-completed',
  imports: [NzCardModule, BaseChartDirective],
  templateUrl: './dashboard-task-completed.component.html',
  styleUrl: './dashboard-task-completed.component.scss',
})
export class DashboardTaskCompletedComponent {
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
