import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-admin',
  imports: [NzTabsModule, NzLayoutModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  tabItems = [
    {
      title: 'Users',
    },
    {
      title: 'Companies',
    },
    {
      title: 'Projects',
    },
  ];
}
