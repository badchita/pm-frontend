import { Project } from '../../projects/models/project.model';

export interface Task {
  id: number;
  taskName: string;
  description: string;
  acceptanceCriteria: string;
  assignedTo: string;
  taskPoints: number;
  taskIdNumber: string;
  state: number;
  projectId: number;
  stateColor?: string;
  stateLabel?: string;
  readyForDevelopmentDate?: Date;
  doneDate?: Date;
  testingStartDate?: Date;
  testingEndDate?: Date;
  createdBy?: string;
  updatedBy?: string;
  project?: Project;
}
