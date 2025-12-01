import { Component } from '@angular/core';
import { DashboardActiveProjectsComponent } from '../../components/dashboard-active-projects.component/dashboard-active-projects.component';

@Component({
  selector: 'app-home',
  imports: [DashboardActiveProjectsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
