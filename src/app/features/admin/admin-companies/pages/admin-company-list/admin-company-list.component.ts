import { Component } from '@angular/core';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-admin-company-list',
  imports: [ErrorAlertComponent],
  templateUrl: './admin-company-list.component.html',
  styleUrl: './admin-company-list.component.scss',
})
export class AdminCompanyListComponent {
  catchError!: any;
}
