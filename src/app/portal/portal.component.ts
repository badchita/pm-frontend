import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@app/core/layout/header/header.component';
import { NavItem } from '@app/shared/models/nav-item.model';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-portal',
  imports: [RouterOutlet, HeaderComponent, NzLayoutModule, NzMenuModule, NzIconModule],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent {
  private router = inject(Router);

  navItem: NavItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/portal/dashboard',
    },
    {
      title: 'Project List',
      icon: 'unordered-list',
      route: '/portal/project',
    },
    {
      title: 'Task Board',
      icon: 'paper-clip',
      route: '/portal/task',
    },
    {
      title: 'Profile Settings',
      icon: 'setting',
      route: '/portal/setting',
    },
    {
      title: 'Application Settings',
      icon: 'appstore',
      route: '/portal/application',
    },
  ];

  navigate(url: string) {
    this.router.navigate([url]);
  }
}
