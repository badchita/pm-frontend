import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AdminUserListTableComponent } from './components/admin-user-list-table/admin-user-list-table.component';

@Component({
  selector: 'app-admin-user-list',
  imports: [NzButtonModule, AdminUserListTableComponent],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.scss',
})
export class AdminUserListComponent {}
