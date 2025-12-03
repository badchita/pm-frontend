import { Component, inject } from '@angular/core';
import { ProjectListTableComponent } from './components/project-list-table.component/project-list-table.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateProjectModalComponent } from './modals/create-project-modal/create-project-modal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NOTIFICATION_MESSAGE, NOTIFICATION_TITLE } from '@app/shared/constants/ui.constants';
import { Project } from '@app/shared/models/project.model';

@Component({
  selector: 'app-project-list',
  imports: [ProjectListTableComponent, NzButtonModule, NzModalModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent {
  private modalService = inject(NzModalService);
  private notificationService = inject(NzNotificationService);

  NOTIFICATION_TITLE = NOTIFICATION_TITLE;
  NOTIFICATION_MESSAGE = NOTIFICATION_MESSAGE;

  projectListData = [
    {
      id: 1,
      projectName: 'Angular',
      description:
        'This interactive tutorial will teach you the basic building blocks to start building great apps with Angular.',
      progress: 95,
      dueDate: 'Oct 15, 2025',
    },
    {
      id: 2,
      projectName: 'ReactJs',
      description:
        'React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video. Then combine them into entire screens, pages, and apps.',
      progress: 45,
      dueDate: 'Oct 15, 2025',
    },
    {
      id: 3,
      projectName: 'Vuejs',
      description: 'An approachable, performant and versatile framework.',
      progress: 85,
      dueDate: 'Oct 20, 2025',
    },
  ];

  addNewProject() {
    const modal = this.modalService.create({
      nzContent: CreateProjectModalComponent,
      nzTitle: 'Create new project',
      nzClassName: 'create-modal',
      nzFooter: null,
    });

    modal.afterClose.subscribe((project: Project) => {
      if (project) {
        this.notificationService.create(
          'success',
          NOTIFICATION_TITLE.FormCreatedSuccessfully.replace('{{1}}', 'Project Created'),
          NOTIFICATION_MESSAGE.FormCreatedSuccess.replace('{{1}}', project.projectIdNumber),
          {
            nzClass: 'form-notification',
            nzDuration: 5000,
          }
        );
      }
    });
  }
}
