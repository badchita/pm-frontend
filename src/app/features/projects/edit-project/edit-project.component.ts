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
import { finalize, Subject, takeUntil } from 'rxjs';
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
import { TaskListTableComponent } from './components/task-list-table.component/task-list-table.component';
import { DataTable } from '@app/shared/models/data-table.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateEditTaskModalComponent } from '@app/shared/modal/create-edit-task-modal/create-edit-task-modal.component';

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
    TaskListTableComponent,
    NzModalModule,
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss',
})
export class EditProjectComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private notificationService = inject(NzNotificationService);
  private modalService = inject(NzModalService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private _destroying$ = new Subject<void>();

  editProjectForm!: FormGroup;
  projectName!: string;
  projectIdNumber!: string;
  isPublished!: string;

  isLoading = false;
  hasError = false;
  alertDetails: AlertType = {
    type: 'info',
    message: '',
    description: '',
  };
  spinnerTip!: string;
  taskListTable: DataTable<any> = {
    data: [
      {
        id: 1,
        taskName: 'Create new Item',
        taskIdNumber: 'T-001',
        assignedTo: 'Joh Doe',
        state: 'New',
      },
      {
        id: 2,
        taskName: 'Update Controller',
        taskIdNumber: 'T-002',
        assignedTo: 'Joseph James',
        state: 'New',
      },
      {
        id: 3,
        taskName: 'Delete Database',
        taskIdNumber: 'T-003',
        assignedTo: 'Rain',
        state: 'New',
      },
    ],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  };

  SPINNER_TIP = SPINNER_TIP;
  NOTIFICATION_TITLE = NOTIFICATION_TITLE;
  NOTIFICATION_MESSAGE = NOTIFICATION_MESSAGE;
  ALERT_MESAGE = ALERT_MESAGE;
  ALERT_DESCRIPTION = ALERT_DESCRIPTION;

  ngOnInit() {
    this.spinnerTip = SPINNER_TIP.loadingData;
    this.buildForm();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.loadProject(id);
    });
  }

  loadProject(id: string) {
    this.isLoading = true;

    this.projectService
      .getById(+id)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
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
    this.spinnerTip = this.SPINNER_TIP.Updating.replace('{{1}}', this.projectIdNumber ?? '');
    const payload = this.editProjectForm.getRawValue();

    this.projectService
      .update(payload)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
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
    this.isLoading = true;
    this.spinnerTip = this.SPINNER_TIP.Updating.replace('{{1}}', this.projectIdNumber ?? '');

    const payload = { ...this.editProjectForm.getRawValue() };
    const publishTitle = this.isPublished === 'N' ? 'Project Published' : 'Project Deactivated';
    const publishMessage =
      this.isPublished === 'N' ? 'ProjectFormPublishedSuccess' : 'ProjectFormDeactivatedSuccess';

    this.projectService
      .publish(payload.id, this.isPublished, payload)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
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

  addNewTask() {
    const modal = this.modalService.create({
      nzContent: CreateEditTaskModalComponent,
      nzClassName: 'create-modal',
      nzFooter: null,
      nzWidth: '1000px',
      nzTitle: 'Create task'
    });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
