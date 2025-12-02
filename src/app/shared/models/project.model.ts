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
}
