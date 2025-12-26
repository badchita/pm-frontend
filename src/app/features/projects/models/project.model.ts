import { Task } from '@app/features/tasks/models/task.model';

export interface ProjectForm {
  projectName: string;
  description: string;
}

export interface Project {
  id: number;
  projectIdNumber: string;
  projectName: string;
  description: string;
  createdBy: string;
  isPublished: string;
  isDeleted: string;
  createdAt: Date;
  dueDate?: Date | string;
  tasks?: Task[];
}
