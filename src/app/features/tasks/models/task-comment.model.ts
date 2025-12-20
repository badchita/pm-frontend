import { User } from '@app/features/auth/models/user.model';
import { Task } from '../models/task.model';

export interface TaskComment {
  id: number;
  taskId: number;
  userId: number;
  user: User;
  task: Task;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
