import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SPINNER_TIP } from '@app/shared/constants/ui.constants';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { RequiredValidator } from '@app/shared/constants/validators';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { ProjectService } from '@app/features/projects/services/project.service';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-create-project-modal',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    PopoverFormValidatorDirective,
    ErrorAlertComponent,
  ],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.scss',
})
export class CreateProjectModalComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private modalRef = inject(NzModalRef);

  private _destroying$ = new Subject<void>();

  SPINNER_TIP = SPINNER_TIP;

  createProjectForm!: FormGroup;
  catchError!: any;

  isLoading = false;

  ngOnInit() {
    this.createProjectForm = this.formBuilder.group({
      projectName: [null, RequiredValidator],
      description: [null, RequiredValidator],
    });
  }

  reset() {
    this.createProjectForm.reset();
  }

  create() {
    this.isLoading = true;
    this.SPINNER_TIP.Creating = this.SPINNER_TIP.Creating.replace('{{1}}', 'Project');
    const payload = this.createProjectForm.getRawValue();

    this.projectService
      .create(payload)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (project) => {
          if (project) {
            this.modalRef.close(project.projectIdNumber);
          }
        },
        error: (error) => {
          this.catchError = error;
        },
      });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
