import { Component, inject, OnDestroy } from '@angular/core';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { AdminCompanyListTableComponent } from './components/admin-company-list-table/admin-company-list-table.component';
import { CompanyService } from '../../services/company.service';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-admin-company-list',
  imports: [ErrorAlertComponent, AdminCompanyListTableComponent],
  templateUrl: './admin-company-list.component.html',
  styleUrl: './admin-company-list.component.scss',
})
export class AdminCompanyListComponent implements OnDestroy {
  private readonly companySerivce = inject(CompanyService);
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
  companyDataTable: DataTable<Company> = {
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  };
  catchError!: any;

  isLoading = false;
  isDeleted: 'Y' | 'N' = 'N';

  loadCompanies(params?: NzTableQueryParams) {
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

    this.companySerivce
      .getList(this.tableParams, filters)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (dataTable) => {
          this.companyDataTable = dataTable;
        },
        error: (error) => {
          this.catchError = error;
        },
      });
  }

  tableUpdate(tableParams: NzTableQueryParams) {
    this.loadCompanies(tableParams);
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
