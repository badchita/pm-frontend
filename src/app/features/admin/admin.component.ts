import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-admin',
  imports: [NzTabsModule, NzLayoutModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private readonly router = inject(Router);

  tabItems = [
    {
      title: 'Users',
      route: '/portal/admin/users',
    },
    {
      title: 'Companies',
      route: '/portal/admin/companies',
    },
    {
      title: 'Projects',
      route: '/portal/admin/projects',
    },
  ];

  activeIndex = 0;

  ngOnInit() {
    this.syncTabWithRoute();
  }

  onTabChange(index: number) {
    this.router.navigateByUrl(this.tabItems[index].route);
  }

  syncTabWithRoute() {
    const current = this.router.url;
    const index = this.tabItems.findIndex((t) => current.startsWith(t.route));
    this.activeIndex = index === -1 ? 0 : index;
  }
}
