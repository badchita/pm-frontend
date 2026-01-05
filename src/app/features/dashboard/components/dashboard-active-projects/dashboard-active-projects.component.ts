import { Component, effect, input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BaseChartDirective } from 'ng2-charts';
import { ActiveProjectProgress } from '../../models/dashboard.model';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-active-projects',
  imports: [NzCardModule, BaseChartDirective],
  templateUrl: './dashboard-active-projects.component.html',
  styleUrl: './dashboard-active-projects.component.scss',
})
export class DashboardActiveProjectsComponent {
  totalActiveProjects = input.required<number>();
  projectsInProgress = input.required<ActiveProjectProgress[]>();

  chartData = {
    labels: [] as string[],
    datasets: [
      {
        axis: 'y',
        data: [] as number[],
        fill: false,
        backgroundColor: ['rgba(132, 11, 220, 1)'],
      },
    ],
  };

  chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
      },
    },
  };

  constructor() {
    effect(() => {
      const projects = this.projectsInProgress();

      if (!projects || projects.length === 0) {
        this.chartData = {
          labels: [],
          datasets: [
            {
              axis: 'y',
              data: [],
              fill: false,
              backgroundColor: ['rgba(132, 11, 220, 1)'],
            },
          ],
        };
        return;
      }

      this.chartData = {
        labels: projects.map((p) => p.projectName),
        datasets: [
          {
            axis: 'y',
            data: projects.map((p) => p.progressPercentage),
            fill: false,
            backgroundColor: ['rgba(132, 11, 220, 1)'],
          },
        ],
      };
    });
  }
}
