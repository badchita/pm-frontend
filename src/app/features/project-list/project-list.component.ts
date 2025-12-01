import { Component } from '@angular/core';
import { ProjectListTableComponent } from './components/project-list-table.component/project-list-table.component';

@Component({
  selector: 'app-project-list',
  imports: [ProjectListTableComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent {}
