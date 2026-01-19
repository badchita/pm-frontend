import { User } from '@app/features/auth/models/user.model';
import { Task } from '../models/task.model';
import { TaskCommentReaction } from './task-comment-reaction-model';

export interface TaskComment {
  id: number;
  content: string;
  taskId: number;
  userId: number;
  user: User;
  task: Task;
  reactions?: TaskCommentReaction[];
  totalLikeReaction?: number;
  totalDislikeReaction?: number;
  hasUserLiked?: boolean;
  hasUserDisLiked?: boolean;
  reactionLikeUsers: User[];
  reactionDislikeUsers: User[];
  createdAt: Date;
  updatedAt: Date;
  displayTime?: string;
}
