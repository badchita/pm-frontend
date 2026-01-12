import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-admin-company-user-list-table',
  imports: [NzTableModule],
  templateUrl: './admin-company-user-list-table.component.html',
  styleUrl: './admin-company-user-list-table.component.scss',
})
export class AdminCompanyUserListTableComponent {}
