import { Component } from '@angular/core';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-admin-project-list',
  imports: [ErrorAlertComponent],
  templateUrl: './admin-project-list.component.html',
  styleUrl: './admin-project-list.component.scss',
})
export class AdminProjectListComponent {
  catchError!: any;
}
