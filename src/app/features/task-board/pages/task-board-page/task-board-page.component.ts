import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Task } from '@app/features/tasks/models/task.model';
import { SPINNER_TIP } from '@app/shared/constants/ui.constants';
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
import { ActivatedRoute } from '@angular/router';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { TaskBoardColumn } from '../../models/task-board.model';

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
  ],
  templateUrl: './task-board-page.component.html',
  styleUrl: './task-board-page.component.scss',
})
export class TaskBoardPageComponent implements OnInit, OnDestroy {
  @ViewChild('board', { static: true })
  boardRef!: ElementRef<HTMLDivElement>;

  private readonly taskboardService = inject(TaskboardService);
  private readonly route = inject(ActivatedRoute);

  private readonly _destroying$ = new Subject<void>();

  scrollInterval?: number;
  spinnerTip!: string;
  catchError!: any;
  tasks!: Task[];

  isLoading = false;
  SPINNER_TIP = SPINNER_TIP;
  State = TaskStateOptions;
  StateColor = TaskStateColorOptions;

  columns: TaskBoardColumn[] = [
    { state: State.New, label: 'New', tasks: [] as Task[], color: this.StateColor[State.New] },
    {
      state: State.Refinement,
      label: 'Refinement',
      tasks: [] as Task[],
      color: this.StateColor[State.Refinement],
    },
    {
      state: State.ReadyForDevelopment,
      label: 'Ready',
      tasks: [] as Task[],
      color: this.StateColor[State.ReadyForDevelopment],
    },
    {
      state: State.InProgress,
      label: 'In Progress',
      tasks: [] as Task[],
      color: this.StateColor[State.InProgress],
    },
    {
      state: State.Testing,
      label: 'Testing',
      tasks: [] as Task[],
      color: this.StateColor[State.Testing],
    },
    {
      state: State.Deployed,
      label: 'Deployed',
      tasks: [] as Task[],
      color: this.StateColor[State.Deployed],
    },
    {
      state: State.Closed,
      label: 'Closed',
      tasks: [] as Task[],
      color: this.StateColor[State.Closed],
    },
  ];

  ngOnInit() {
    this.isLoading = true;

    this.route.paramMap.subscribe((params) => {
      const projectId = params.get('projectId')!;
      this.loadProjects(projectId);
    });
  }

  loadProjects(projectId: string) {
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

  private mapTasksToColumns(): void {
    this.columns.forEach((col) => (col.tasks = []));
    this.tasks.forEach((task) => {
      const column = this.columns.find((c) => c.state === task.state);
      column?.tasks.push(task);
    });
  }

  onDragMoved(event: CdkDragMove): void {
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

  onDragEnded(): void {
    this.stopAutoScroll();
  }

  private startAutoScroll(speed: number): void {
    if (this.scrollInterval) return;

    const board = this.boardRef.nativeElement;

    this.scrollInterval = globalThis.setInterval(() => {
      board.scrollLeft += speed;
    }, 16);
  }

  private stopAutoScroll(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = undefined;
    }
  }

  onDrop(event: CdkDragDrop<Task[]>, targetState: State): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTask = event.container.data[event.currentIndex];
      movedTask.state = targetState;
    }
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
