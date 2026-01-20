import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DashboardActiveProjectsComponent } from '../../components/dashboard-active-projects/dashboard-active-projects.component';
import { DashboardUpcomingDeadlinesComponent } from '../../components/dashboard-upcoming-deadlines/dashboard-upcoming-deadlines.component';
import { DashboardTaskCompletedComponent } from '../../components/dashboard-task-completed/dashboard-task-completed.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { DashboardQuickAccessComponent } from '../../components/dashboard-quick-access/dashboard-quick-access.component';
import { DashboardService } from '../../services/dashboard.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {
  ActiveProjectProgress,
  TasksCompletedByProject,
  UpcomingProject,
} from '../../models/dashboard.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateProjectModalComponent } from '@app/features/projects/pages/project-list/modals/create-project-modal/create-project-modal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NOTIFICATION_MESSAGE, NOTIFICATION_TITLE } from '@app/shared/constants/ui.constants';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { UserRole } from '@app/shared/enums/user-role.enum';

@Component({
  selector: 'app-home',
  imports: [
    DashboardActiveProjectsComponent,
    DashboardUpcomingDeadlinesComponent,
    DashboardTaskCompletedComponent,
    NzButtonComponent,
    DashboardQuickAccessComponent,
    NzSpinModule,
    NzModalModule,
    NzGridModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);
  private readonly modalService = inject(NzModalService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly genericUtilityService = inject(GenericUtilityService);

  private readonly _destroying$ = new Subject<void>();

  activeProjects: ActiveProjectProgress[] = [];
  activeProjectsCount!: number;
  upcomingProjects: UpcomingProject[] = [];
  tasksCompletedByProject: TasksCompletedByProject[] = [];

  isLoading = false;

  ngOnInit() {
    const userRoleLocalStorage = localStorage.getItem('user_role');
    const userRole = userRoleLocalStorage ? JSON.parse(userRoleLocalStorage) : null;

    if (userRole !== UserRole.Admin) {
      this.loadDashboard();
    }
  }

  loadDashboard() {
    this.isLoading = true;

    this.dashboardService
      .getDashboard()
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (dashboard) => {
          this.isLoading = false;
          const {
            activeProjects,
            activeProjectsCount,
            upcomingDeadlines,
            tasksCompletedByProject,
          } = dashboard;

          this.activeProjects = activeProjects;
          this.activeProjectsCount = activeProjectsCount;
          this.upcomingProjects = upcomingDeadlines;
          this.tasksCompletedByProject = tasksCompletedByProject;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  addNewProject() {
    const modal = this.modalService.create({
      nzContent: CreateProjectModalComponent,
      nzTitle: 'Create new project',
      nzClassName: 'create-modal',
      nzFooter: null,
    });

    modal.afterClose.subscribe((projectIdNumber: string) => {
      if (projectIdNumber) {
        this.loadDashboard();
        this.notificationService.create(
          'success',
          NOTIFICATION_TITLE.FormSuccess.replace('{{1}}', 'Project Created'),
          this.genericUtilityService.formatMessage(NOTIFICATION_MESSAGE.FormCreatedSuccess, [
            'project',
            'project',
            projectIdNumber,
          ]),
          {
            nzClass: 'form-notification',
            nzDuration: 5000,
          },
        );
      }
    });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
