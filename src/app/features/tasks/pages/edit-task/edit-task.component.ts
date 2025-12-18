import { Component, inject, OnInit } from '@angular/core';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-task.component',
  imports: [TaskFormComponent],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent implements OnInit {
  private route = inject(ActivatedRoute);

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
    console.log(taskIdNumber);
  }
}
