import { Component } from '@angular/core';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { AdminCompanyListTableComponent } from './components/admin-company-list-table/admin-company-list-table.component';

@Component({
  selector: 'app-admin-company-list',
  imports: [ErrorAlertComponent, AdminCompanyListTableComponent],
  templateUrl: './admin-company-list.component.html',
  styleUrl: './admin-company-list.component.scss',
})
export class AdminCompanyListComponent {
  catchError!: any;
}
