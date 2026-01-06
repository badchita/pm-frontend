import { Component, inject, OnDestroy } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AdminUserListTableComponent } from './components/admin-user-list-table/admin-user-list-table.component';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UserService } from '@app/shared/services/api/user.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { User } from '@app/features/auth/models/user.model';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-admin-user-list',
  imports: [NzButtonModule, AdminUserListTableComponent, ErrorAlertComponent],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.scss',
})
export class AdminUserListComponent implements OnDestroy {
  private readonly userSerivce = inject(UserService);

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
  userDataTable: DataTable<User> = {
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  };
  catchError!: any;

  isLoading = false;

  loadUsers(params?: NzTableQueryParams) {
    this.isLoading = true;

    let filters;
    if (params) {
      this.tableParams.page = params.pageIndex;
      this.tableParams.pageSize = params.pageSize;
      filters = Object.assign({}, ...params.filter);
      this.tableParams.sort = params.sort;
    }

    this.userSerivce
      .getList(this.tableParams, filters)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (dataTable) => {
          this.userDataTable = dataTable;
        },
        (error) => {
          this.catchError = error;
        }
      );
  }

  tableUpdate(tableParams: NzTableQueryParams) {
    this.loadUsers(tableParams);
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
