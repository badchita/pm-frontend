import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Task } from '@app/features/tasks/models/task.model';
import { SPINNER_TIP } from '@app/shared/constants/ui.constants';
import { State, TaskStateColorOptions } from '@app/shared/enums/task-state.enum';
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
  ],
  templateUrl: './task-board-page.component.html',
  styleUrl: './task-board-page.component.scss',
})
export class TaskBoardPageComponent {
  @ViewChild('board', { static: true })
  boardRef!: ElementRef<HTMLDivElement>;

  scrollInterval?: number;
  spinnerTip!: string;

  isLoading = false;
  SPINNER_TIP = SPINNER_TIP;
  State = State;
  StateColor = TaskStateColorOptions;

  tasks: Task[] = [
    {
      id: 1,
      taskName: 'Setup project',
      description: 'Initialize repository and base config',
      acceptanceCriteria: 'Project builds successfully',
      assignedTo: 'John Doe',
      taskPoints: 3,
      taskIdNumber: 'TASK-001',
      state: State.New,
      stateLabel: 'New',
      stateColor: this.StateColor[State.New],
      createdBy: 'Admin',
      updatedBy: 'Admin',
      projectId: 101,
    },
    {
      id: 2,
      taskName: 'Refine requirements',
      description: 'Clarify functional scope',
      acceptanceCriteria: 'Requirements approved',
      assignedTo: 'Jane Smith',
      taskPoints: 5,
      taskIdNumber: 'TASK-002',
      state: State.Refinement,
      stateLabel: 'Refinement',
      stateColor: this.StateColor[State.Refinement],
      createdBy: 'Admin',
      updatedBy: 'Admin',
      projectId: 101,
    },
    {
      id: 3,
      taskName: 'Create UI',
      description: 'Build task board UI',
      acceptanceCriteria: 'Board supports drag & drop',
      assignedTo: 'Val Ryan',
      taskPoints: 8,
      taskIdNumber: 'TASK-003',
      state: State.InProgress,
      stateLabel: 'In Progress',
      stateColor: this.StateColor[State.InProgress],
    },
    {
      id: 4,
      taskName: 'Write tests',
      description: 'Add unit and e2e tests',
      acceptanceCriteria: 'Coverage above 80%',
      assignedTo: 'QA Team',
      taskPoints: 5,
      taskIdNumber: 'TASK-004',
      state: State.Testing,
      stateLabel: 'Testing',
      stateColor: this.StateColor[State.Testing],
    },
    {
      id: 5,
      taskName: 'Deploy app',
      description: 'Deploy to production',
      acceptanceCriteria: 'App accessible in prod',
      assignedTo: 'DevOps',
      taskPoints: 2,
      taskIdNumber: 'TASK-005',
      state: State.Deployed,
      stateLabel: 'Deployed',
      stateColor: this.StateColor[State.Deployed],
    },
  ];

  columns = [
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

  constructor() {
    this.mapTasksToColumns();
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
}
