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
import { Subject, Subscription, takeUntil } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {
  ALERT_DESCRIPTION,
  ALERT_MESAGE,
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
  SPINNER_TIP,
} from '@app/shared/constants/ui.constants';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RequiredValidator } from '@app/shared/constants/validators';
import { AlertType } from '@app/shared/models/alert.model';
import { NzAlertModule } from 'ng-zorro-antd/alert';

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
    NzAlertModule,
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

  isLoading!: Subscription;
  hasError = false;
  alertDetails: AlertType = {
    type: 'info',
    message: '',
    description: '',
  };

  SPINNER_TIP = SPINNER_TIP;
  NOTIFICATION_TITLE = NOTIFICATION_TITLE;
  NOTIFICATION_MESSAGE = NOTIFICATION_MESSAGE;
  ALERT_MESAGE = ALERT_MESAGE;
  ALERT_DESCRIPTION = ALERT_DESCRIPTION;

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
      projectName: [null, RequiredValidator],
      description: [null, RequiredValidator],
      createdBy: [{ disabled: true, value: null }],
      isPublished: [null],
      isDeleted: [null],
      createdAt: [null],
      dueDate: [null, RequiredValidator],
    });
  }

  close() {
    this.router.navigate([`/portal/projects`]);
  }

  save() {
    this.SPINNER_TIP.Updating = this.SPINNER_TIP.Updating.replace(
      '{{1}}',
      this.projectIdNumber ?? ''
    );
    const payload = this.editProjectForm.getRawValue();

    this.isLoading = this.projectService
      .update(payload)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (project) => {
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
        },
        (error) => {
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

  publish() {
    this.SPINNER_TIP.Updating = this.SPINNER_TIP.Updating.replace(
      '{{1}}',
      this.projectIdNumber ?? ''
    );

    const id = this.editProjectForm.get('id')?.value;
    const publishTitle = this.isPublished === 'N' ? 'Project Published' : 'Project Deactivated';
    const publishMessage =
      this.isPublished === 'N' ? 'ProjectFormPublishedSuccess' : 'ProjectFormDeactivatedSuccess';

    this.isLoading = this.projectService
      .publish(id, this.isPublished)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (project) => {
          if (project) {
            this.notificationService.create(
              'success',
              NOTIFICATION_TITLE.FormSuccess.replace('{{1}}', publishTitle),
              NOTIFICATION_MESSAGE[publishMessage].replace('{{1}}', project.projectIdNumber),
              {
                nzClass: 'form-notification',
                nzDuration: 5000,
              }
            );
            this.close();
          }
        },
        (error) => {
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
