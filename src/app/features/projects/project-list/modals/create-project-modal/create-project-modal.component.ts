import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Subject, takeUntil } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ALERT_DESCRIPTION, ALERT_MESAGE, SPINNER_TIP } from '@app/shared/constants/ui.constants';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { RequiredValidator } from '@app/shared/constants/validators';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { AlertType } from '@app/shared/models/alert.model';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { ProjectService } from '@app/features/projects/services/project.service';

@Component({
  selector: 'app-create-project-modal',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    PopoverFormValidatorDirective,
    NzAlertModule,
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
  ALERT_MESAGE = ALERT_MESAGE;
  ALERT_DESCRIPTION = ALERT_DESCRIPTION;

  createProjectForm!: FormGroup;
  isLoading = false;
  hasError = false;
  alertDetails: AlertType = {
    type: 'info',
    message: '',
    description: '',
  };

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
    const payload = this.createProjectForm.getRawValue();

    this.projectService
      .create(payload)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (response) => {
          this.isLoading = false;

          if (response) {
            this.modalRef.close(response);
          }
        },
        (error) => {
          this.isLoading = false;
          this.hasError = true;
          switch (error.status) {
            case 0:
              this.alertDetails = {
                type: 'error',
                message: ALERT_MESAGE.NoInternetConnection,
                description: ALERT_DESCRIPTION.PleaseCheckYourNetworkAndTryAgain,
              };
              break;
            case 401:
              this.alertDetails = {
                type: 'error',
                message: ALERT_MESAGE.LoginFailed,
                description: ALERT_DESCRIPTION.LoginFailedMessage,
              };
              break;
            case 500:
              this.alertDetails = {
                type: 'error',
                message: ALERT_MESAGE.UnexpectedErroIinternalServerError,
                description: ALERT_DESCRIPTION.AnUnexpectedErrorOccurredPleaseTryAgainLater,
              };
              break;
          }
        }
      );
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
