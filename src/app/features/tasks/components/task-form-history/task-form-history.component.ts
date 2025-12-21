import { Component } from '@angular/core';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: 'app-task-form-history',
  imports: [NzTimelineModule],
  templateUrl: './task-form-history.component.html',
  styleUrl: './task-form-history.component.scss',
})
export class TaskFormHistoryComponent {}
