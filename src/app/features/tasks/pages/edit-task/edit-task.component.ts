import { Component, inject, OnInit } from '@angular/core';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-task.component',
  imports: [TaskFormComponent, NzButtonModule, NzIconModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  localtion = inject(Location);

  projectId!: number;
  taskId!: number;
  taskIdNumber!: string;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.projectId = +params.get('projectId')!;
      this.taskId = +params.get('id')!;
    });
  }

  getTaskIdNumber(taskIdNumber: string) {
    this.taskIdNumber = taskIdNumber;
  }
}
