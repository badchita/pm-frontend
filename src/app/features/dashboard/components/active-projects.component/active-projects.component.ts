import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-active-projects',
  imports: [NzCardModule, BaseChartDirective],
  templateUrl: './active-projects.component.html',
  styleUrl: './active-projects.component.scss',
})
export class ActiveProjectsComponent {
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
