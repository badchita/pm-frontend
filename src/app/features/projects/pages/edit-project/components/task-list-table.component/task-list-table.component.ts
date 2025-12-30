import { I18nPluralPipe } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
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
import { NzSelectItemInterface, NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { debounceTime } from 'rxjs';
import { Router } from '@angular/router';

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
export class TaskListTableComponent implements OnInit {
  readonly dataTable = input.required<DataTable<any>>();
  readonly dataList = input.required<Task[] | []>();
  readonly loading = input.required<boolean>();
  readonly userOptions = input.required<{ label: string; value: string }[]>();
  readonly onUpdateTable = output<NzTableQueryParams>();
  readonly onAssignedToSearch = output<string>();

  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  searchProjectTaskForm!: FormGroup;
  disableFilter: (input: string, option: NzSelectItemInterface) => boolean = () => true;

  stateOptions = this.genericUtilityService.objectToArray(TaskStateOptions);

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchProjectTaskForm = this.formBuilder.group({
      search: [null],
      state: [null],
      assignedTo: [null],
    });

    this.searchProjectTaskForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchProjectTaskForm
      .get('state')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchProjectTaskForm
      .get('assignedTo')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());
  }

  updateTable(params?: NzTableQueryParams) {
    const searchFormValues = this.searchProjectTaskForm.getRawValue();
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

  reset() {
    this.searchProjectTaskForm.reset();
  }

  edit(task: Task) {
    const { projectId, id } = task;

    this.router.navigate([`/portal/tasks/${projectId}/${id}`]);
  }

  assignedToSearch(searchValue: string) {
    this.onAssignedToSearch.emit(searchValue);
  }
}
