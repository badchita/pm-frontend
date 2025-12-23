import { TaskCommentReactionType } from '@app/shared/enums/task-comment-reaction.enum';
import { TaskComment } from './task-comment.model';

export interface TaskCommentReaction {
  id?: number;
  taskCommentId: number;
  taskComment?: TaskComment;
  userId: number;
  reactionType: TaskCommentReactionType | null;
  createdAt?: Date;
}
