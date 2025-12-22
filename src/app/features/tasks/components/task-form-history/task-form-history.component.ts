import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { TaskService } from '../../services/task.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { STATE_HISTORY_LABEL } from '@app/shared/constants/ui.constants';
import { State, TaskStateColorOptions, TaskStateOptions } from '@app/shared/enums/task-state.enum';
import { DatePipe } from '@angular/common';
import { TaskHistory } from '../../models/task-state-history.model';

@Component({
  selector: 'app-task-form-history',
  imports: [NzTimelineModule, ErrorAlertComponent, DatePipe],
  templateUrl: './task-form-history.component.html',
  styleUrl: './task-form-history.component.scss',
})
export class TaskFormHistoryComponent implements OnInit, OnDestroy {
  taskId = input.required<number>();

  private taskService = inject(TaskService);

  private _destroying$ = new Subject<void>();

  catchError!: any;
  taskHistories!: TaskHistory[];
  stateMap: Record<string, keyof typeof State> = {
    New: 'New',
    Refinement: 'Refinement',
    ReadyForDevelopment: 'ReadyForDevelopment',
    InProgress: 'InProgress',
    Testing: 'Testing',
    Deployed: 'Deployed',
    Closed: 'Closed',
  };

  isLoading = false;
  STATE_HISTORY_LABEL = STATE_HISTORY_LABEL;
  TaskStateOptions = TaskStateOptions;
  TaskStateColorOptions = TaskStateColorOptions;

  ngOnInit() {
    this.loadHistories();
  }

  loadHistories() {
    this.isLoading = true;

    this.taskService
      .getAllTaskStateHistory(this.taskId())
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (histories) => {
          this.taskHistories = histories.map((history) => {
            const historyLabel = STATE_HISTORY_LABEL.MovedTo.replace(
              '{{1}}',
              history.newState < history.previousState ? 'back' : ''
            );
            const setLabel = STATE_HISTORY_LABEL.Set;

            return {
              label:
                histories.length === 1
                  ? `${setLabel}` + ` ${this.TaskStateOptions[history.newState]}`
                  : `${historyLabel}` + ` ${this.TaskStateOptions[history.newState]}`,
              color: this.TaskStateColorOptions[history.newState],
              changedBy: history.changedBy,
              changedAt: history.changedAt,
            };
          });
        },
        (error) => {
          this.catchError = error;
        }
      );
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
