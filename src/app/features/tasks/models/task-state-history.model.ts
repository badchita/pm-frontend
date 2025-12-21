import { State } from '@app/shared/enums/task-state.enum';

export interface TaskStateHistory {
  id: number;
  taskId: number;
  previousState: number;
  newState: State;
  changedBy: string;
  changedAt: Date;
}

export interface TaskHistory {
  label: string;
  color: string;
  changedBy: string;
  changedAt: Date;
}
