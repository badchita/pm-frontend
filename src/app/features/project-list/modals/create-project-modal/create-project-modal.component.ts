import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-create-project-modal',
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.scss',
})
export class CreateProjectModalComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  createProjectForm!: FormGroup;

  ngOnInit() {
    this.createProjectForm = this.formBuilder.group({
      projectName: [''],
      description: [''],
    });
  }

  reset() {
    this.createProjectForm.reset();
  }
}
