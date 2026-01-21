import { Component, inject, OnDestroy } from '@angular/core';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { AdminProjectListTableComponent } from './components/admin-project-list-table/admin-project-list-table.component';
import { ProjectService } from '@app/features/projects/services/project.service';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Project } from '@app/features/projects/models/project.model';

@Component({
  selector: 'app-admin-project-list',
  imports: [ErrorAlertComponent, AdminProjectListTableComponent],
  templateUrl: './admin-project-list.component.html',
  styleUrl: './admin-project-list.component.scss',
})
export class AdminProjectListComponent implements OnDestroy {
  private readonly projectSerivce = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);

  private readonly _destroying$ = new Subject<void>();

  tableParams: TableParams = {
    search: '',
    isApproved: '',
    companyId: 0,
    role: '',
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
  catchError!: any;

  isLoading = false;
  isDeleted: 'Y' | 'N' = 'N';

  loadUsers(params?: NzTableQueryParams) {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      if (params['isDeleted'] === 'Y') {
        this.isDeleted = params['isDeleted'];
      }
    });
    let filters: Record<string, any> = { isDeleted: this.isDeleted };

    if (params) {
      this.tableParams.page = params.pageIndex;
      this.tableParams.pageSize = params.pageSize;
      filters = Object.assign({}, ...params.filter);
      this.tableParams.sort = params.sort;
    }

    this.projectSerivce
      .getList(this.tableParams, filters)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (dataTable) => {
          this.projectDataTable = dataTable;
        },
        error: (error) => {
          this.catchError = error;
        },
      });
  }

  tableUpdate(tableParams: NzTableQueryParams) {
    this.loadUsers(tableParams);
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
