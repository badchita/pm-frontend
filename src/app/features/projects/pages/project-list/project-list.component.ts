import { Component, inject, OnDestroy } from '@angular/core';
import { ProjectListTableComponent } from './components/project-list-table.component/project-list-table.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateProjectModalComponent } from './modals/create-project-modal/create-project-modal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NOTIFICATION_MESSAGE, NOTIFICATION_TITLE } from '@app/shared/constants/ui.constants';
import { Project } from '@app/features/projects/models/project.model';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  imports: [ProjectListTableComponent, NzButtonModule, NzModalModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnDestroy {
  private modalService = inject(NzModalService);
  private notificationService = inject(NzNotificationService);
  private projectService = inject(ProjectService);
  private genericUtilityService = inject(GenericUtilityService);

  private _destroying$ = new Subject<void>();

  NOTIFICATION_TITLE = NOTIFICATION_TITLE;
  NOTIFICATION_MESSAGE = NOTIFICATION_MESSAGE;

  tableParams: TableParams = {
    search: '',
    isPublished: '',
    sort: [
      {
        key: '',
        value: '',
      },
    ],
    page: 1,
    pageSize: 10,
    sortDirection: 'desc',
  };
  projectDataTable: DataTable<Project> = {
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  };
  isLoading = false;

  addNewProject() {
    const modal = this.modalService.create({
      nzContent: CreateProjectModalComponent,
      nzTitle: 'Create new project',
      nzClassName: 'create-modal',
      nzFooter: null,
    });

    modal.afterClose.subscribe((projectIdNumber: string) => {
      if (projectIdNumber) {
        this.loadProjects();
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
          }
        );
      }
    });
  }

  loadProjects(params?: NzTableQueryParams) {
    this.isLoading = true;
    let filters;
    if (params) {
      this.tableParams.page = params.pageIndex;
      this.tableParams.pageSize = params.pageSize;
      filters = Object.assign({}, ...params.filter);
      this.tableParams.sort = params.sort;
    }

    this.projectService
      .getList(this.tableParams, filters)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((dataTable) => {
        this.projectDataTable = dataTable;
      });
  }

  tableUpdate(tableParams: NzTableQueryParams) {
    this.loadProjects(tableParams);
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
