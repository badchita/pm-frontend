import { DatePipe, I18nPluralPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Company } from '@app/features/admin/admin-companies/models/company.model';
import { UserStatusOptions } from '@app/shared/enums/search.enum';
import { DataTable } from '@app/shared/models/data-table.model';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { debounceTime, Subject } from 'rxjs';

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

  private readonly genericUtilityService = inject(GenericUtilityService);
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

  reset() {
    this.searchCompanyForm.reset();
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
