import { Component } from '@angular/core';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import { Project } from '../../models/project.model';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-edit-project',
  imports: [ProjectFormComponent, NzTagModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss',
})
export class EditProjectComponent {
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
