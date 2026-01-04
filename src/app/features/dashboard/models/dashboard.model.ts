export interface Dashboard {
  activeProjectsCount: number;
  activeProjects: ActiveProjectProgress[];
  upcomingDeadlines: UpcomingProject[];
  tasksCompletedByProject: TasksCompletedByProject[];
}

export interface ActiveProjectProgress {
  projectId: number;
  projectName: string;
  dueDate: Date; // ISO string from API
  totalTasks: number;
  closedTasks: number;
  progressPercentage: number;
}

export interface UpcomingProject {
  projectId: number;
  projectName: string;
  dueDate: Date;
  remainingDays: number;
}

export interface TasksCompletedByProject {
  projectName: string;
  completedTasks: number;
}
