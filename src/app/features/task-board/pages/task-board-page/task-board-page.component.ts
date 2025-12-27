import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Task } from '@app/features/tasks/models/task.model';
import {
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
  SPINNER_TIP,
} from '@app/shared/constants/ui.constants';
import { State, TaskStateColorOptions, TaskStateOptions } from '@app/shared/enums/task-state.enum';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
  CdkDropListGroup,
  CdkDragMove,
} from '@angular/cdk/drag-drop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TaskboardService } from '../../services/taskboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { TaskBoardColumn } from '../../models/task-board.model';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateTaskModalComponent } from '@app/features/tasks/modals/create-task-modal/create-task-modal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';

@Component({
  selector: 'app-task-board-page',
  imports: [
    NzSpinModule,
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    NzCardModule,
    NzTagModule,
    ErrorAlertComponent,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
  ],
  templateUrl: './task-board-page.component.html',
  styleUrl: './task-board-page.component.scss',
})
export class TaskBoardPageComponent implements OnInit, OnDestroy {
  @ViewChild('board', { static: true })
  boardRef!: ElementRef<HTMLDivElement>;

  private readonly taskboardService = inject(TaskboardService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly modalService = inject(NzModalService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly _destroying$ = new Subject<void>();

  scrollInterval?: number;
  spinnerTip!: string;
  catchError!: any;
  tasks!: Task[];
  projectName!: string;
  projectIdNumber!: string;
  projectId!: number;
  columns!: TaskBoardColumn[];

  isLoading = false;
  SPINNER_TIP = SPINNER_TIP;
  State = TaskStateOptions;
  StateColor = TaskStateColorOptions;
  NOTIFICATION_TITLE = NOTIFICATION_TITLE;
  NOTIFICATION_MESSAGE = NOTIFICATION_MESSAGE;

  ngOnInit() {
    this.isLoading = true;

    this.columns = [
      {
        state: State.New,
        label: this.State[State.New],
        tasks: [],
        color: this.StateColor[State.New],
      },
      {
        state: State.Refinement,
        label: this.State[State.Refinement],
        tasks: [],
        color: this.StateColor[State.Refinement],
      },
      {
        state: State.ReadyForDevelopment,
        label: this.State[State.ReadyForDevelopment],
        tasks: [],
        color: this.StateColor[State.ReadyForDevelopment],
      },
      {
        state: State.InProgress,
        label: this.State[State.InProgress],
        tasks: [],
        color: this.StateColor[State.InProgress],
      },
      {
        state: State.Testing,
        label: this.State[State.Testing],
        tasks: [],
        color: this.StateColor[State.Testing],
      },
      {
        state: State.Deployed,
        label: this.State[State.Deployed],
        tasks: [],
        color: this.StateColor[State.Deployed],
      },
      {
        state: State.Closed,
        label: this.State[State.Closed],
        tasks: [],
        color: this.StateColor[State.Closed],
      },
    ];

    this.route.paramMap.subscribe((params) => {
      this.projectId = +params.get('projectId')!;
      this.loadProject(this.projectId);
    });
  }

  loadProject(projectId: number) {
    this.taskboardService
      .getProject(+projectId)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (project) => {
          if (project.tasks) {
            this.projectName = project.projectName;
            this.projectIdNumber = project.projectIdNumber;

            this.tasks = project.tasks.map((task) => ({
              ...task,
              stateLabel: this.State[task.state as State],
              stateColor: this.StateColor[task.state as State],
            }));

            this.mapTasksToColumns();
          }
        },
        (error) => {
          this.catchError = error;
        }
      );
  }

  private mapTasksToColumns() {
    this.columns.forEach((col) => (col.tasks = []));
    this.tasks.forEach((task) => {
      const column = this.columns.find((c) => c.state === task.state);
      column?.tasks.push(task);
    });
  }

  onDragMoved(event: CdkDragMove) {
    const board = this.boardRef.nativeElement;
    const boardRect = board.getBoundingClientRect();
    const pointerX = event.pointerPosition.x;

    const edgeThreshold = 80;
    const scrollSpeed = 20;

    if (pointerX > boardRect.right - edgeThreshold) {
      this.startAutoScroll(scrollSpeed);
    } else if (pointerX < boardRect.left + edgeThreshold) {
      this.startAutoScroll(-scrollSpeed);
    } else {
      this.stopAutoScroll();
    }
  }

  onDragEnded() {
    this.stopAutoScroll();
  }

  private startAutoScroll(speed: number) {
    if (this.scrollInterval) return;

    const board = this.boardRef.nativeElement;

    this.scrollInterval = globalThis.setInterval(() => {
      board.scrollLeft += speed;
    }, 16);
  }

  private stopAutoScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = undefined;
    }
  }

  private getStateMeta(state: State) {
    return this.columns.find((c) => c.state === state);
  }

  onDrop(event: CdkDragDrop<Task[]>, targetState: State) {
    const task = event.previousContainer.data[event.previousIndex];

    if (!task || task.state === targetState) {
      return;
    }

    const previousState = task.state;
    const previousContainerData = [...event.previousContainer.data];
    const targetContainerData = [...event.container.data];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const meta = this.getStateMeta(targetState);
    if (meta) {
      task.state = targetState;
      task.stateLabel = meta.label;
      task.stateColor = meta.color;
    }

    this.taskboardService
      .updateTaskState(task.id, { state: targetState })
      .pipe(takeUntil(this._destroying$))
      .subscribe({
        error: (error) => {
          event.previousContainer.data.splice(
            0,
            event.previousContainer.data.length,
            ...previousContainerData
          );

          event.container.data.splice(0, event.container.data.length, ...targetContainerData);

          task.state = previousState;
          this.catchError = error;
        },
      });
  }

  navigateToEditTask(projectId: number, taskId: number) {
    this.router.navigate([`/portal/tasks/${projectId}/${taskId}`]);
  }

  addNewTask() {
    const modal = this.modalService.create({
      nzContent: CreateTaskModalComponent,
      nzClassName: 'create-modal',
      nzData: {
        projectId: this.projectId,
      },
      nzFooter: null,
      nzWidth: '1000px',
      nzTitle: 'Create task',
      nzCentered: true,
    });

    modal.afterClose.subscribe((taskNumber: string) => {
      if (taskNumber) {
        this.loadProject(this.projectId);
        this.notificationService.create(
          'success',
          NOTIFICATION_TITLE.FormSuccess.replace('{{1}}', 'Task Created'),
          this.genericUtilityService.formatMessage(NOTIFICATION_MESSAGE.FormCreatedSuccess, [
            'task',
            'task',
            taskNumber,
          ]),
          {
            nzClass: 'form-notification',
            nzDuration: 5000,
          }
        );
      }
    });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
