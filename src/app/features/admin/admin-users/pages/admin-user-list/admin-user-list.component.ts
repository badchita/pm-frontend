import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-admin-user-list',
  imports: [NzButtonModule],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.scss',
})
export class AdminUserListComponent {}
