import { DatePipe, I18nPluralPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '@app/features/auth/models/user.model';
import { DataTable } from '@app/shared/models/data-table.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { debounceTime, Subject } from 'rxjs';
import { UserRolePipe } from '../../pipes/user-role.pipe';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { UserStatusOptions } from '@app/shared/enums/search.enum';

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
  ],
  templateUrl: './admin-user-list-table.component.html',
  styleUrl: './admin-user-list-table.component.scss',
})
export class AdminUserListTableComponent implements OnInit, OnDestroy {
  readonly dataTable = input.required<DataTable<User>>();
  readonly dataList = input.required<User[] | []>();
  readonly loading = input.required<boolean>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly genericUtilityService = inject(GenericUtilityService);

  private readonly _destroying$ = new Subject<void>();

  searchUserForm!: FormGroup;

  userStatusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchUserForm = this.formBuilder.group({
      search: [null],
      isApproved: [null],
      isPublished: [null],
    });

    this.searchUserForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchUserForm
      .get('isApproved')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchUserForm
      .get('isPublished')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());
  }

  updateTable(params?: NzTableQueryParams) {
    const searchFormValues = this.searchUserForm.getRawValue();
    const isFiltering =
      searchFormValues.search || searchFormValues.description || searchFormValues.dueDate;
    const filter: NzTableQueryParams['filter'] = [{ ...searchFormValues }];

    const tableParams: NzTableQueryParams = {
      pageIndex: isFiltering ? 1 : params?.pageIndex ?? this.dataTable().page,
      pageSize: params?.pageSize ?? this.dataTable().pageSize,
      sort: params?.sort ?? [],
      filter: filter,
    };

    this.onUpdateTable.emit(tableParams);
  }

  reset() {
    this.searchUserForm.reset();
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
