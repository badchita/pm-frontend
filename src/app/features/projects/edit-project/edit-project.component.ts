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
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
  SPINNER_TIP,
} from '@app/shared/constants/ui.constants';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
    NzSpinModule,
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss',
})
export class EditProjectComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private notificationService = inject(NzNotificationService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private _destroying$ = new Subject<void>();

  editProjectForm!: FormGroup;
  projectName!: string;
  projectIdNumber!: string;
  isPublished!: string;

  isLoading = false;

  SPINNER_TIP = SPINNER_TIP;
  NOTIFICATION_TITLE = NOTIFICATION_TITLE;
  NOTIFICATION_MESSAGE = NOTIFICATION_MESSAGE;

  ngOnInit() {
    this.buildForm();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.loadProject(id);
    });
  }

  loadProject(id: string) {
    this.projectService
      .getById(+id)
      .pipe(takeUntil(this._destroying$))
      .subscribe((project) => {
        const { projectName, projectIdNumber, isPublished } = project;

        this.projectName = projectName;
        this.projectIdNumber = projectIdNumber;
        this.isPublished = isPublished;

        this.editProjectForm.patchValue(project, { emitEvent: false });
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

  save() {
    this.isLoading = true;
    this.SPINNER_TIP.Updating = this.SPINNER_TIP.Updating.replace(
      '{{1}}',
      this.projectIdNumber ?? ''
    );
    const payload = this.editProjectForm.getRawValue();

    this.projectService
      .update(payload)
      .pipe(takeUntil(this._destroying$))
      .subscribe((project) => {
        this.isLoading = false;

        if (project) {
          this.notificationService.create(
            'success',
            NOTIFICATION_TITLE.FormSuccess.replace('{{1}}', 'Project Updated'),
            NOTIFICATION_MESSAGE.FormUpdatedSuccess.replace('{{1}}', project.projectIdNumber),
            {
              nzClass: 'form-notification',
              nzDuration: 5000,
            }
          );
          this.editProjectForm.patchValue(project, { emitEvent: false });
        }
      });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
