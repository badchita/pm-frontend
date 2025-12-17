import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, of, Subject, switchMap, takeUntil } from 'rxjs';
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
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateEditTaskModalComponent } from '@app/shared/modal/create-edit-task-modal/create-edit-task-modal.component';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TaskStateColorOptions, TaskStateOptions } from '@app/shared/enums/task-state.enum';
import { Task } from '@app/shared/models/task.model';
import { ProjectService } from '../../services/project.service';

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
  private genericUtilityService = inject(GenericUtilityService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private _destroying$ = new Subject<void>();

  editProjectForm!: FormGroup;
  projectName!: string;
  projectIdNumber!: string;
  isPublished!: string;

  isLoading = false;
  isTableLoading = false;
  hasError = false;
  alertDetails: AlertType = {
    type: 'info',
    message: '',
    description: '',
  };
  spinnerTip!: string;
  taskDataTable: DataTable<Task> = {
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  };
  tableParams: TableParams = {
    search: '',
    state: null,
    sort: [
      {
        key: '',
        value: '',
      },
    ],
    page: 1,
    pageSize: 10,
    sortDirection: 'desc',
  };

  stateColorOptions = this.genericUtilityService.objectToArray(TaskStateColorOptions, false, true);
  stateOptions = this.genericUtilityService.objectToArray(TaskStateOptions, false, true);
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
      this.loadData(id);
    });
  }

  loadData(id: string) {
    this.isLoading = true;

    this.projectService
      .getById(+id)
      .pipe(
        takeUntil(this._destroying$),

        switchMap((project) => {
          const { projectName, projectIdNumber, isPublished } = project;

          this.projectName = projectName;
          this.projectIdNumber = projectIdNumber;
          this.isPublished = isPublished;
          this.editProjectForm.patchValue(project, { emitEvent: false });

          if (isPublished === 'N') {
            return of({
              data: [],
              totalCount: 0,
              page: this.tableParams.page,
              pageSize: this.tableParams.pageSize,
            } as DataTable<Task>);
          }

          return this.projectService.getProjectTaskList(this.tableParams, {}, +id);
        }),

        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (tasksTable: DataTable<Task>) => {
          this.setTableData(tasksTable);
        },
        (error) => {
          console.error('Failed to load project data', error);
        }
      );
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
    this.isLoading = true;
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
      nzData: {
        projectId: this.id?.value,
      },
      nzFooter: null,
      nzWidth: '1000px',
      nzTitle: 'Create task',
      nzCentered: true,
    });

    modal.afterClose.subscribe((taskNumber: string) => {
      if (taskNumber) {
        this.loadData(this.id?.value);
        this.notificationService.create(
          'success',
          NOTIFICATION_TITLE.FormSuccess.replace('{{1}}', 'Task Created'),
          this.genericUtilityService.formatMessage(NOTIFICATION_MESSAGE.FormCreatedSuccess, [
            'task',
            'task',
            taskNumber,
          ]),
          {
            nzClass: 'form-notification',
            nzDuration: 5000,
          }
        );
      }
    });
  }

  tableUpdate(params: NzTableQueryParams) {
    this.isTableLoading = true;
    this.tableParams.page = params.pageIndex;
    this.tableParams.pageSize = params.pageSize;
    const filters = Object.assign({}, ...params.filter);
    this.tableParams.sort = params.sort;

    this.projectService
      .getProjectTaskList(this.tableParams, filters, this.id?.value)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe(
        (tasks) => {
          this.setTableData(tasks);
        },
        (error) => {
          console.error('Failed to load project data', error);
        }
      );
  }

  setTableData(tableData: DataTable<Task>) {
    this.taskDataTable = tableData;
    this.taskDataTable.data = tableData.data.map((task) => ({
      ...task,
      stateColor: this.genericUtilityService.getStateColor(task.state),
      stateLabel: this.genericUtilityService.getStateText(task.state),
    }));
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  get id(): AbstractControl | null | undefined {
    return this.editProjectForm?.get('id');
  }
}
