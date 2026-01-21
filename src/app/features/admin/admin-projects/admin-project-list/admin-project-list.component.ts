import { Component } from '@angular/core';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { AdminProjectListTableComponent } from './components/admin-project-list-table/admin-project-list-table.component';

@Component({
  selector: 'app-admin-project-list',
  imports: [ErrorAlertComponent, AdminProjectListTableComponent],
  templateUrl: './admin-project-list.component.html',
  styleUrl: './admin-project-list.component.scss',
})
export class AdminProjectListComponent {
  catchError!: any;
}
