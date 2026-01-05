import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@app/core/layout/header/header.component';
import { NavItem } from '@app/shared/models/nav-item.model';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    HeaderComponent,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonComponent,
    NgClass,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private readonly router = inject(Router);

  navItem: NavItem[] = [
    {
      title: 'User List',
      icon: 'user',
      route: '/admin',
    },
  ];
  currentRoute!: string;

  isCollapsed = false;
  isWhiteBackground = false;

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }
}
