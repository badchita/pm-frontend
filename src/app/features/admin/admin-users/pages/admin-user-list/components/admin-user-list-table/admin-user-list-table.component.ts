import { DatePipe, I18nPluralPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '@app/features/auth/models/user.model';
import { DataTable } from '@app/shared/models/data-table.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { UserRolePipe } from '../../pipes/user-role.pipe';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { UserStatusOptions } from '@app/shared/enums/search.enum';
import { Router } from '@angular/router';
import {
  MODAL_DESCRIPTION,
  MODAL_TITLE,
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
} from '@app/shared/constants/ui.constants';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { UserService } from '@app/shared/services/api/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-admin-user-list-table',
  imports: [
    NzTableModule,
    NzIconModule,
    NzDividerModule,
    I18nPluralPipe,
    NzButtonModule,
    UserRolePipe,
    DatePipe,
    NzTagModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzModalModule,
  ],
  templateUrl: './admin-user-list-table.component.html',
  styleUrl: './admin-user-list-table.component.scss',
})
export class AdminUserListTableComponent implements OnInit, OnDestroy {
  readonly dataTable = input.required<DataTable<User>>();
  readonly dataList = input.required<User[] | []>();
  readonly loading = input.required<boolean>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private readonly userService = inject(UserService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly modalService = inject(NzModalService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly _destroying$ = new Subject<void>();

  searchUserForm!: FormGroup;

  userStatusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);
  isDeleted = 'N';

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchUserForm = this.formBuilder.group({
      search: [null],
      isApproved: [null],
    });

    this.searchUserForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchUserForm
      .get('isApproved')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());
  }

  updateTable(params?: NzTableQueryParams) {
    const searchFormValues = this.searchUserForm.getRawValue();
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
      this.router.navigate([`/portal/admin/users`], { queryParams: { isDeleted: 'Y' } });
    } else {
      this.router.navigate([`/portal/admin/users`]);
    }

    this.updateTable();
  }

  edit(id: number) {
    this.router.navigate([`/portal/admin/users/${id}`]);
  }

  deleteRestoreProject(id: number, isDeleted: string) {
    const modalTitle =
      isDeleted === 'Y'
        ? MODAL_TITLE.SoftDeleteConfirmation.replace('{{1}}', 'user')
        : MODAL_TITLE.RestoreConfirmation.replace('{{1}}', 'user');
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
        this.userService
          .softDelete(id, isDeleted)
          .pipe(takeUntil(this._destroying$))
          .subscribe({
            next: () => {
              const notificationTitle =
                isDeleted === 'Y'
                  ? NOTIFICATION_TITLE.SoftDeleteSuccess.replace('{{1}}', 'Project')
                  : NOTIFICATION_TITLE.RestoreSuccess.replace('{{1}}', 'Project');
              const notificationDescription =
                isDeleted === 'Y'
                  ? NOTIFICATION_MESSAGE.SoftDeleteMessageSuccess.replace('{{1}}', 'project')
                  : NOTIFICATION_MESSAGE.RestoreMessageSuccess.replace('{{1}}', 'project');

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
    this.searchUserForm.reset();
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
