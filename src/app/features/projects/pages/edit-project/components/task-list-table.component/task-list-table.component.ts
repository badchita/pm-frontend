import { I18nPluralPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
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
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  MODAL_DESCRIPTION,
  MODAL_TITLE,
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
} from '@app/shared/constants/ui.constants';
import { TaskService } from '@app/features/tasks/services/task.service';

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
export class TaskListTableComponent implements OnInit, OnDestroy {
  readonly dataTable = input.required<DataTable<any>>();
  readonly dataList = input.required<Task[] | []>();
  readonly loading = input.required<boolean>();
  readonly userOptions = input.required<{ label: string; value: string }[]>();
  readonly onUpdateTable = output<NzTableQueryParams>();
  readonly onAssignedToSearch = output<string>();

  private readonly taskService = inject(TaskService);
  private readonly modalService = inject(NzModalService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly _destroying$ = new Subject<void>();

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

  delete(projectId: number, id: number) {
    this.modalService.confirm({
      nzTitle: MODAL_TITLE.PermanentlyDeleteConfirmation.replace('{{1}}', 'Task'),
      nzContent: MODAL_DESCRIPTION.PermanentlyDeleteConfirmationMessage.replace('{{1}}', 'task'),
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.taskService
          .delete(projectId, id)
          .pipe(takeUntil(this._destroying$))
          .subscribe(() => {
            this.notificationService.create(
              'success',
              NOTIFICATION_TITLE.PermanentlyDeleteSuccess.replace('{{1}}', 'Task'),
              NOTIFICATION_MESSAGE.PermanentlyDeleteMessageSuccess.replace('{{1}}', 'task'),
              {
                nzClass: 'form-notification',
                nzDuration: 5000,
              }
            );
            this.updateTable();
          });
      },
      nzCancelText: 'No',
    });
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

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
