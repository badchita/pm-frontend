import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-admin-company-list-table',
  imports: [NzTableModule, NzTagModule],
  templateUrl: './admin-company-list-table.component.html',
  styleUrl: './admin-company-list-table.component.scss',
})
export class AdminCompanyListTableComponent {}
