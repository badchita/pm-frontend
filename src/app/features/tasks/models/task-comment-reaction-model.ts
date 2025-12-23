import { TaskCommentReactionType } from '@app/shared/enums/task-comment-reaction.enum';
import { TaskComment } from './task-comment.model';
import { User } from '@app/features/auth/models/user.model';

export interface TaskCommentReaction {
  id?: number | null;
  taskCommentId: number;
  taskComment?: TaskComment;
  userId: number;
  user?: User;
  reactionType: TaskCommentReactionType | null;
  createdAt?: Date;
}
