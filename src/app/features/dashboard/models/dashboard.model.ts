export interface Dashboard {
  activeProjectsCount: number;
  activeProjects: ActiveProjectProgress[];
  upcomingDeadlines: UpcomingProject[];
  tasksCompletedByProject: TasksCompletedByProject[];
}

export interface ActiveProjectProgress {
  projectId: number;
  projectName: string;
  dueDate: Date;
  totalTasks: number;
  closedTasks: number;
  progressPercentage: number;
}

export interface UpcomingProject {
  projectId: number;
  projectName: string;
  dueDate: Date | string;
  remainingDays: number;
}

export interface TasksCompletedByProject {
  projectName: string;
  completedTasks: number;
}
