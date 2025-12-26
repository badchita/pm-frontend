import { Task } from '@app/features/tasks/models/task.model';
import { State } from '@app/shared/enums/task-state.enum';

export interface TaskBoardColumn {
  state: State;
  label: string;
  tasks: Task[];
  color: string;
}
