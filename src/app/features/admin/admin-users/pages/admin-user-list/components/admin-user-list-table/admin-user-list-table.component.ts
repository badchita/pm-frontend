import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-admin-user-list-table',
  imports: [NzTableModule, NzIconModule, NzDividerModule],
  templateUrl: './admin-user-list-table.component.html',
  styleUrl: './admin-user-list-table.component.scss',
})
export class AdminUserListTableComponent {}
