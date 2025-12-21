export interface TaskStateHistory {
  id: number;
  taskId: number;
  previousState: number;
  newState: number;
  changedBy: string;
  changedAt: Date;
}
