import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@app/core/layout/header/header.component';
import { NavItem } from '@app/shared/models/nav-item.model';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-portal',
  imports: [
    RouterOutlet,
    HeaderComponent,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonComponent,
    NgClass,
  ],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent implements OnInit {
  private router = inject(Router);

  @ViewChild('collapseButtonContainer') collapseButtonContainerRef!: ElementRef;

  navItem: NavItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/portal/dashboard',
    },
    {
      title: 'Project List',
      icon: 'unordered-list',
      route: '/portal/project-list',
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

  isCollapsed = false;
  currentRoute!: string;

  ngOnInit() {
    const currentUrl = this.router.url;
    this.currentRoute = currentUrl;
  }
  navigate(url: string) {
    this.router.navigate([url]);
  }
}
