import { Component } from '@angular/core';
import { ActiveProjectsComponent } from '../../components/active-projects.component/active-projects.component';

@Component({
  selector: 'app-home',
  imports: [ActiveProjectsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
