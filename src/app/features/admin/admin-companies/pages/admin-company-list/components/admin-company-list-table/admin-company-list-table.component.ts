import { DatePipe, I18nPluralPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Company } from '@app/features/admin/admin-companies/models/company.model';
import { CompanyService } from '@app/features/admin/admin-companies/services/company.service';
import {
  MODAL_DESCRIPTION,
  MODAL_TITLE,
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
} from '@app/shared/constants/ui.constants';
import { UserStatusOptions } from '@app/shared/enums/search.enum';
import { DataTable } from '@app/shared/models/data-table.model';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-company-list-table',
  imports: [
    NzTableModule,
    NzIconModule,
    NzDividerModule,
    I18nPluralPipe,
    NzButtonModule,
    DatePipe,
    NzTagModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzModalModule,
  ],
  templateUrl: './admin-company-list-table.component.html',
  styleUrl: './admin-company-list-table.component.scss',
})
export class AdminCompanyListTableComponent implements OnInit, OnDestroy {
  readonly dataTable = input.required<DataTable<Company>>();
  readonly dataList = input.required<Company[] | []>();
  readonly loading = input.required<boolean>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private readonly _destroying$ = new Subject<void>();

  private readonly companyService = inject(CompanyService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly modalService = inject(NzModalService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  searchCompanyForm!: FormGroup;

  companyStatusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);
  isDeleted = 'N';

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchCompanyForm = this.formBuilder.group({
      search: [null],
      isApproved: [null],
      isPublished: [null],
    });

    this.searchCompanyForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchCompanyForm
      .get('isApproved')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());
  }

  updateTable(params?: NzTableQueryParams) {
    const searchFormValues = this.searchCompanyForm.getRawValue();
    const isFiltering =
      searchFormValues.search || searchFormValues.description || searchFormValues.dueDate;
    const filter: NzTableQueryParams['filter'] = [
      { ...searchFormValues, isDeleted: this.isDeleted },
    ];

    const tableParams: NzTableQueryParams = {
      pageIndex: isFiltering ? 1 : params?.pageIndex ?? this.dataTable().page,
      pageSize: params?.pageSize ?? this.dataTable().pageSize,
      sort: params?.sort ?? [],
      filter: filter,
    };

    this.onUpdateTable.emit(tableParams);
  }

  recycleBin(event: MouseEvent, isOpen = 'N') {
    event.stopPropagation();
    this.isDeleted = isOpen;
    if (isOpen === 'Y') {
      this.router.navigate([`/portal/admin/companies`], { queryParams: { isDeleted: 'Y' } });
    } else {
      this.router.navigate([`/portal/admin/companies`]);
    }

    this.updateTable();
  }

  edit(id: number) {
    this.router.navigate([`/portal/admin/companies/${id}`]);
  }

  deleteRestoreProject(id: number, isDeleted: string) {
    const modalTitle =
      isDeleted === 'Y'
        ? MODAL_TITLE.SoftDeleteConfirmation.replace('{{1}}', 'company')
        : MODAL_TITLE.RestoreConfirmation.replace('{{1}}', 'company');
    const modaDescription =
      isDeleted === 'Y'
        ? MODAL_DESCRIPTION.SoftDeleteConfirmationMessage.replace('{{1}}', 'user')
        : MODAL_DESCRIPTION.RestoreConfirmationMessage.replace('{{1}}', 'user');

    this.modalService.confirm({
      nzTitle: modalTitle,
      nzContent: modaDescription,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.companyService
          .softDelete(id, isDeleted)
          .pipe(takeUntil(this._destroying$))
          .subscribe({
            next: () => {
              const notificationTitle =
                isDeleted === 'Y'
                  ? NOTIFICATION_TITLE.SoftDeleteSuccess.replace('{{1}}', 'Company')
                  : NOTIFICATION_TITLE.RestoreSuccess.replace('{{1}}', 'Company');
              const notificationDescription =
                isDeleted === 'Y'
                  ? NOTIFICATION_MESSAGE.SoftDeleteMessageSuccess.replace('{{1}}', 'company')
                  : NOTIFICATION_MESSAGE.RestoreMessageSuccess.replace('{{1}}', 'company');

              this.notificationService.create(
                'success',
                notificationTitle,
                notificationDescription,
                {
                  nzClass: 'form-notification',
                  nzDuration: 5000,
                }
              );
              this.updateTable();
            },
          });
      },
      nzCancelText: 'No',
    });
  }

  reset() {
    this.searchCompanyForm.reset();
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
