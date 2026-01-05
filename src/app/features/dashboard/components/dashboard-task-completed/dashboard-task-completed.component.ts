import { Component, effect, input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BaseChartDirective } from 'ng2-charts';
import { TasksCompletedByProject } from '../../models/dashboard.model';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-task-completed',
  imports: [NzCardModule, BaseChartDirective],
  templateUrl: './dashboard-task-completed.component.html',
  styleUrl: './dashboard-task-completed.component.scss',
})
export class DashboardTaskCompletedComponent {
  projectTasksCompleted = input.required<TasksCompletedByProject[]>();

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

  chartOptions: ChartOptions<'line'> = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => Number(value).toString(),
        },
      },
    },
  };

  constructor() {
    effect(() => {
      const projects = this.projectTasksCompleted();

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
            data: projects.map((p) => p.completedTasks),
            fill: false,
            backgroundColor: ['rgba(132, 11, 220, 1)'],
          },
        ],
      };
    });
  }
}
