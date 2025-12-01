import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-dashboard-quick-access',
  imports: [NzCardModule, NzButtonModule],
  templateUrl: './dashboard-quick-access.component.html',
  styleUrl: './dashboard-quick-access.component.scss',
})
export class DashboardQuickAccessComponent {}
