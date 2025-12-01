import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-active-projects',
  imports: [NzCardModule],
  templateUrl: './active-projects.component.html',
  styleUrl: './active-projects.component.scss',
})
export class ActiveProjectsComponent {}
