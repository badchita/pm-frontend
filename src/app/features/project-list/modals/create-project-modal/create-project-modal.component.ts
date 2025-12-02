import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProjectListService } from '../../services/project-list.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-project-modal',
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.scss',
})
export class CreateProjectModalComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private projectListService = inject(ProjectListService);

  createProjectForm!: FormGroup;

  private _destroying$ = new Subject<void>();

  ngOnInit() {
    this.createProjectForm = this.formBuilder.group({
      projectName: [''],
      description: [''],
    });
  }

  reset() {
    this.createProjectForm.reset();
  }

  create() {
    const payload = this.createProjectForm.getRawValue();

    this.projectListService
      .create(payload)
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
      });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
