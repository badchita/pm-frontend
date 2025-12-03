import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Subject, takeUntil } from 'rxjs';
import { Project } from '@app/shared/models/project.model';

@Component({
  selector: 'app-edit-project',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    PopoverFormValidatorDirective,
    NzDatePickerModule,
    NzTagModule,
    NzButtonModule,
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss',
})
export class EditProjectComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private _destroying$ = new Subject<void>();

  editProjectForm!: FormGroup;

  projectName!: string;
  projectIdNumber!: string;
  isPublished!: string;

  ngOnInit() {
    this.buildForm();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.loadProject(id);
    });
  }

  loadProject(id: string) {
    this.projectService
      .getProjectById(+id)
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        const { projectName, projectIdNumber, isPublished } = response;

        this.projectName = projectName;
        this.projectIdNumber = projectIdNumber;
        this.isPublished = isPublished;

        this.editProjectForm.patchValue(response, { emitEvent: false });
      });
  }

  buildForm() {
    this.editProjectForm = this.formBuilder.group({
      id: [null],
      projectIdNumber: [{ disabled: true, value: null }],
      projectName: [null],
      description: [null],
      createdBy: [{ disabled: true, value: null }],
      isPublished: [null],
      isDeleted: [null],
      createdAt: [null],
      progress: [null],
      dueDate: [null],
    });
  }

  close() {
    this.router.navigate([`/portal/projects`]);
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
