import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@app/core/layout/header/header.component';
import { ProjectService } from '@app/features/projects/services/project.service';
import { UserRole } from '@app/shared/enums/user-role.enum';
import { NavItem } from '@app/shared/models/nav-item.model';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { filter, Subject, takeUntil } from 'rxjs';

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
export class PortalComponent implements OnInit, OnDestroy {
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);

  private readonly _destroying$ = new Subject<void>();

  @ViewChild('collapseButtonContainer') collapseButtonContainerRef!: ElementRef;

  navItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/portal',
    },
    {
      title: 'Project List',
      icon: 'unordered-list',
      route: '/portal/projects',
    },
    {
      title: 'Task Board',
      icon: 'paper-clip',
      route: '/portal/task-board',
      child: [],
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
  adminNavItem: NavItem = {
    title: 'Admin',
    icon: 'user',
    route: '/portal/admin',
  };
  currentRoute!: string;
  userRole!: UserRole;

  USER_ROLE = UserRole;
  isCollapsed = false;
  isWhiteBackground = false;

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isWhiteBackground = event.urlAfterRedirects.startsWith('/portal/tasks/');
        this.currentRoute = event.url;
      });
  }

  ngOnInit() {
    const userRoleSession = sessionStorage.getItem('user_role');
    this.userRole = userRoleSession ? JSON.parse(userRoleSession) : null;
    this.loadProjects();

    this.projectService.projectPublished$.pipe(takeUntil(this._destroying$)).subscribe(() => {
      this.loadProjects();
    });
  }

  loadProjects() {
    this.projectService
      .getList()
      .pipe(takeUntil(this._destroying$))
      .subscribe({
        next: (dataTable) => {
          const { data } = dataTable;
          const publishedProjects = data.filter((project) => project.isPublished === 'Y');

          let taskBoardIndex = this.navItems.findIndex((item) => item.title === 'Task Board');

          if (publishedProjects.length === 0) {
            if (taskBoardIndex !== -1) {
              this.navItems.splice(taskBoardIndex, 1);
            }
          } else {
            const taskBoardItem = {
              title: 'Task Board',
              icon: 'paper-clip',
              route: '/portal/task-board',
              child: publishedProjects.map((project) => ({
                title: project.projectIdNumber,
                icon: '',
                route: `/portal/task-board/${project.id}`,
              })),
            };

            if (taskBoardIndex === -1) {
              this.navItems.splice(2, 0, taskBoardItem);
            } else {
              this.navItems[taskBoardIndex] = taskBoardItem;
            }
          }
        },
      });
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
