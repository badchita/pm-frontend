import { Component } from '@angular/core';
import { ProjectFormComponent } from '@app/features/projects/components/project-form/project-form.component';
import { Project } from '@app/features/projects/models/project.model';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-admin-edit-project',
  imports: [ProjectFormComponent, NzTagModule],
  templateUrl: './admin-edit-project.component.html',
  styleUrl: './admin-edit-project.component.scss',
})
export class AdminEditProjectComponent {
  projectName!: string;
  projectIdNumber!: string;
  isPublished!: string;

  getProject(project: Project) {
    const { projectName, projectIdNumber, isPublished } = project;

    this.projectName = projectName;
    this.projectIdNumber = projectIdNumber;
    this.isPublished = isPublished;
  }
}
