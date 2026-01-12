import { DatePipe, I18nPluralPipe } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserRolePipe } from '@app/features/admin/admin-users/pages/admin-user-list/pipes/user-role.pipe';
import { User } from '@app/features/auth/models/user.model';
import { UserStatusOptions } from '@app/shared/enums/search.enum';
import { DataTable } from '@app/shared/models/data-table.model';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-admin-company-user-list-table',
  imports: [
    NzTableModule,
    NzTagModule,
    UserRolePipe,
    DatePipe,
    I18nPluralPipe,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './admin-company-user-list-table.component.html',
  styleUrl: './admin-company-user-list-table.component.scss',
})
export class AdminCompanyUserListTableComponent implements OnInit {
  readonly dataTable = input.required<DataTable<any>>();
  readonly dataList = input.required<User[] | []>();
  readonly loading = input.required<boolean>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly formBuilder = inject(FormBuilder);

  searchCompanyUsersForm!: FormGroup;

  userStatusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchCompanyUsersForm = this.formBuilder.group({
      search: [null],
      isApproved: [null],
      companyId: [null],
    });

    this.searchCompanyUsersForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchCompanyUsersForm
      .get('isApproved')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());
  }

  updateTable(params?: NzTableQueryParams) {
    const searchFormValues = this.searchCompanyUsersForm.getRawValue();
    const isFiltering =
      searchFormValues.search || searchFormValues.description || searchFormValues.assignedTo;
    const filter: NzTableQueryParams['filter'] = [{ ...searchFormValues }];

    const tableParams: NzTableQueryParams = {
      pageIndex: isFiltering ? 1 : params?.pageIndex ?? this.dataTable().page,
      pageSize: params?.pageSize ?? this.dataTable().pageSize,
      sort: params?.sort ?? [],
      filter: filter,
    };

    this.onUpdateTable.emit(tableParams);
  }
}
