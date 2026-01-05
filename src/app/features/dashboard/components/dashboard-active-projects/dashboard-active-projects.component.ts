import { Component, input, OnInit } from '@angular/core';
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
export class DashboardActiveProjectsComponent implements OnInit {
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

  ngOnInit() {
    this.projectsInProgress().forEach((project) => {
      this.chartData.labels.push(project.projectName);
      this.chartData.datasets[0].data.push(project.progressPercentage);
    });
  }
}
