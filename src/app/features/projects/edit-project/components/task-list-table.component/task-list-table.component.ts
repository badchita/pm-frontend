import { I18nPluralPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTable } from '@app/shared/models/data-table.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-task-list-table',
  imports: [
    NzTableModule,
    I18nPluralPipe,
    NzTagModule,
    NzIconModule,
    NzDividerModule,
    NzButtonModule,
  ],
  templateUrl: './task-list-table.component.html',
  styleUrl: './task-list-table.component.scss',
})
export class TaskListTableComponent {
  readonly dataTable = input.required<DataTable<any>>();
  readonly dataList = input.required<any[] | []>();
  readonly loading = input.required<boolean>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private formBuilder = inject(FormBuilder);

  searchProjectTaskForm!: FormGroup;

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchProjectTaskForm = this.formBuilder.group({
      search: [null],
      state: [null],
    });
  }

  updateTable(params?: NzTableQueryParams) {
    const searchFormValues = this.searchProjectTaskForm.getRawValue();
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
}
