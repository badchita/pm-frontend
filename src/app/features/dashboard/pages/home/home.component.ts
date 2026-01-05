import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DashboardActiveProjectsComponent } from '../../components/dashboard-active-projects/dashboard-active-projects.component';
import { DashboardUpcomingDeadlinesComponent } from '../../components/dashboard-upcoming-deadlines/dashboard-upcoming-deadlines.component';
import { DashboardTaskCompletedComponent } from '../../components/dashboard-task-completed/dashboard-task-completed.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { DashboardQuickAccessComponent } from '../../components/dashboard-quick-access/dashboard-quick-access.component';
import { DashboardService } from '../../services/dashboard.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ActiveProjectProgress, UpcomingProject } from '../../models/dashboard.model';

@Component({
  selector: 'app-home',
  imports: [
    DashboardActiveProjectsComponent,
    DashboardUpcomingDeadlinesComponent,
    DashboardTaskCompletedComponent,
    NzButtonComponent,
    DashboardQuickAccessComponent,
    NzSpinModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);

  private readonly _destroying$ = new Subject<void>();

  activeProjects: ActiveProjectProgress[] = [];
  activeProjectsCount!: number;
  upcomingProjects: UpcomingProject[] = [];

  isLoading = false;

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;

    this.dashboardService
      .getDashboard()
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (dashboard) => {
          this.isLoading = false;
          this.activeProjects = dashboard.activeProjects;
          this.activeProjectsCount = dashboard.activeProjectsCount;
          this.upcomingProjects = dashboard.upcomingDeadlines;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
