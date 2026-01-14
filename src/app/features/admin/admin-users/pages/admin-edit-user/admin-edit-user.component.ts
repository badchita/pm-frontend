import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '@app/features/admin/admin-companies/models/company.model';
import { CompanyService } from '@app/features/admin/admin-companies/services/company.service';
import { AdminAssignableUserTableComponent } from '@app/features/admin/shared/components/admin-assignable-user-table/admin-assignable-user-table.component';
import { User } from '@app/features/auth/models/user.model';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import {
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
  SPINNER_TIP,
} from '@app/shared/constants/ui.constants';
import { EmailValidator, RequiredValidator } from '@app/shared/constants/validators';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { UserStatusOptions } from '@app/shared/enums/search.enum';
import { UserRoleOptions } from '@app/shared/enums/user-role.enum';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { UserService } from '@app/shared/services/api/user.service';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectItemInterface, NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { finalize, forkJoin, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-edit-user',
  imports: [
    NzSpinModule,
    NzTagModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzGridModule,
    PopoverFormValidatorDirective,
    NzSelectModule,
    NzButtonModule,
    ErrorAlertComponent,
    DatePipe,
    AdminAssignableUserTableComponent,
  ],
  templateUrl: './admin-edit-user.component.html',
  styleUrl: './admin-edit-user.component.scss',
})
export class AdminEditUserComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly companyService = inject(CompanyService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly _destroying$ = new Subject<void>();

  editUserForm!: FormGroup;
  spinnerTip!: string;
  catchError!: any;
  userStatus!: string;
  userCreated!: Date | string;
  originalUser: any;
  companies!: { label: string; value: number }[];
  disableFilter: (input: string, option: NzSelectItemInterface) => boolean = () => true;
  userDataTable: DataTable<User> = {
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  };
  tableParams: TableParams = {
    search: '',
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

  isLoading = false;
  isTableError = false;
  isTableLoading = false;
  roleOptions = this.genericUtilityService.objectToArray(UserRoleOptions, false, true);
  statusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);
  hasChanges = false;

  ngOnInit() {
    this.spinnerTip = SPINNER_TIP.loadingData;
    this.buildForm();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.loadData(id);
    });
  }

  buildForm() {
    this.editUserForm = this.formBuilder.group({
      id: [null],
      name: [null, RequiredValidator],
      email: [null, [...RequiredValidator, EmailValidator]],
      isApproved: [null, RequiredValidator],
      role: [null, RequiredValidator],
      companyId: [null, RequiredValidator],
    });
  }

  loadData(id: string) {
    this.isLoading = true;

    forkJoin({
      user: this.userService.getById(+id),
      companies: this.loadCompanies({}),
    })
      .pipe(
        takeUntil(this._destroying$),
        switchMap(({ user, companies }) => {
          this.userStatus = user.isApproved;
          this.userCreated = user.createdAt;
          this.originalUser = { ...user };
          this.editUserForm.patchValue(user, { emitEvent: false });
          this.editUserForm.markAsPristine();
          this.editUserForm.markAsUntouched();

          this.editUserForm.valueChanges.pipe(takeUntil(this._destroying$)).subscribe((value) => {
            this.hasChanges = Object.keys(value).some((key) => {
              return value[key] !== this.originalUser?.[key];
            });
          });

          this.setCompanies(companies);

          if (user.isApproved === 'N') {
            return of(null);
          }

          return this.companyService.getUserList(this.tableParams, {}, user.companyId, user.id);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (userTable: DataTable<User> | null) => {
          if (userTable) {
            this.setTableData(userTable);
          }
        },
        error: (error) => {
          this.catchError = error;
        },
      });
  }

  setTableData(tableData: DataTable<User>) {
    this.userDataTable = tableData;
  }

  tableUpdate(params?: NzTableQueryParams) {
    this.isTableError = false;
    this.isTableLoading = true;
    let filters;

    if (params) {
      this.tableParams.page = params.pageIndex;
      this.tableParams.pageSize = params.pageSize;
      this.tableParams.sort = params.sort;
      filters = Object.assign({}, ...params.filter);
    }

    this.companyService
      .getUserList(this.tableParams, filters, this.companyId?.value, this.id?.value)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe({
        next: (userTable) => {
          this.setTableData(userTable);
        },
        error: (error) => {
          this.catchError = error;
          this.isTableError = true;
        },
      });
  }

  loadCompanies(filter?: any): Observable<Company[]> {
    return this.companyService.getSearchCompanies(filter);
  }

  searchCompanies(searchValue: string) {
    this.loadCompanies({ search: searchValue })
      .pipe(takeUntil(this._destroying$))
      .subscribe({
        next: (companies) => {
          this.setCompanies(companies);
        },
      });
  }

  setCompanies(companies: Company[]) {
    this.companies = companies.map((company) => ({
      label: company.name,
      value: company.id,
    }));
  }

  close() {
    this.router.navigate([`/portal/admin/users`]);
  }

  save() {
    this.isLoading = true;
    this.spinnerTip = SPINNER_TIP.Updating.replace('{{1}}', 'user');
    const payload = this.editUserForm.getRawValue();

    this.userService
      .update(payload)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (user) => {
          this.notificationService.create(
            'success',
            NOTIFICATION_TITLE.FormSuccess.replace('{{1}}', 'User Updated'),
            NOTIFICATION_MESSAGE.FormUpdatedSuccess.replace('{{1}}', 'User'),
            {
              nzClass: 'form-notification',
              nzDuration: 5000,
            }
          );
          this.userStatus = user.isApproved;

          this.editUserForm.patchValue(user, { emitEvent: false });
          this.editUserForm.markAsPristine();
          this.editUserForm.markAsUntouched();
        },
        error: (error) => {
          this.catchError = error;
        },
      });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  get id(): AbstractControl | null | undefined {
    return this.editUserForm?.get('id');
  }
  get companyId(): AbstractControl | null | undefined {
    return this.editUserForm?.get('companyId');
  }
}
