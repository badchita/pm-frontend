import { User } from '@app/features/auth/models/user.model';
import { Task } from '../models/task.model';

export interface TaskComment {
  id: number;
  content: string;
  taskId: number;
  userId: number;
  user: User;
  task: Task;
  createdAt: Date;
  updatedAt: Date;
}
