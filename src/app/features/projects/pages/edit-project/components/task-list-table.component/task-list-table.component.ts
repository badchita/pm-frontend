import { I18nPluralPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskStateOptions } from '@app/shared/enums/task-state.enum';
import { DataTable } from '@app/shared/models/data-table.model';
import { Task } from '@app/features/tasks/models/task.model';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-task-list-table',
  imports: [
    NzTableModule,
    I18nPluralPipe,
    NzTagModule,
    NzIconModule,
    NzDividerModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzInputModule,
  ],
  templateUrl: './task-list-table.component.html',
  styleUrl: './task-list-table.component.scss',
})
export class TaskListTableComponent {
  readonly dataTable = input.required<DataTable<any>>();
  readonly dataList = input.required<Task[] | []>();
  readonly loading = input.required<boolean>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private genericUtilityService = inject(GenericUtilityService);
  private formBuilder = inject(FormBuilder);

  searchProjectTaskForm!: FormGroup;

  stateOptions = this.genericUtilityService.objectToArray(TaskStateOptions);

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchProjectTaskForm = this.formBuilder.group({
      search: [null],
      state: [null],
    });

    this.searchProjectTaskForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchProjectTaskForm
      .get('state')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());
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

  reset() {
    this.searchProjectTaskForm.reset();
  }
}
