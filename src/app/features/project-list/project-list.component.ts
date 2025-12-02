import { Component } from '@angular/core';
import { ProjectListTableComponent } from './components/project-list-table.component/project-list-table.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-project-list',
  imports: [ProjectListTableComponent, NzButtonModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent {
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
}
