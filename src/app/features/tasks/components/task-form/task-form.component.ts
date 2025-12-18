import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { TaskStateOptions } from '@app/shared/enums/task-state.enum';
import { TaskStateTagComponent } from '@app/shared/components/task-state-tag/task-state-tag.component';
import { RequiredValidator } from '@app/shared/constants/validators';
import {
  ALERT_DESCRIPTION,
  ALERT_MESAGE,
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
  SPINNER_TIP,
} from '@app/shared/constants/ui.constants';
import { finalize, pipe, Subject, takeUntil } from 'rxjs';
import { AlertType } from '@app/shared/models/alert.model';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TaskFormDetailsComponent } from '../../components/task-form-details/task-form-details.component';
import { TaskService } from '../../services/task.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-task-form',
  imports: [
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    PopoverFormValidatorDirective,
    NzSelectModule,
    NzGridModule,
    NzTypographyModule,
    NzTabsModule,
    TaskFormDetailsComponent,
    TaskStateTagComponent,
    PopoverFormValidatorDirective,
    NzSpinModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit, OnDestroy {
  readonly projectId = input.required<number>();
  readonly id = input.required<number>();
  readonly onSave = output<string>();

  private genericUtilityService = inject(GenericUtilityService);
  private taskService = inject(TaskService);
  private notificationService = inject(NzNotificationService);
  private formBuilder = inject(FormBuilder);

  private _destroying$ = new Subject<void>();

  createEditTaskForm!: FormGroup;
  spinnerTip!: string;

  hoverdInputs = {
    title: false,
    assignedTo: false,
    state: false,
  };
  tabs = [
    {
      name: 'Details',
    },
    {
      icon: 'redo',
    },
  ];
  stateOptions = this.genericUtilityService.objectToArray(TaskStateOptions, false, true);
  isLoading = false;
  hasError = false;
  alertDetails: AlertType = {
    type: 'info',
    message: '',
    description: '',
  };
  SPINNER_TIP = SPINNER_TIP;
  ALERT_MESAGE = ALERT_MESAGE;
  ALERT_DESCRIPTION = ALERT_DESCRIPTION;
  NOTIFICATION_TITLE = NOTIFICATION_TITLE;
  NOTIFICATION_MESSAGE = NOTIFICATION_MESSAGE;

  ngOnInit() {
    this.buildForm();

    if (this.id() > 0) {
      this.loadTask();
    }
  }

  buildForm() {
    this.createEditTaskForm = this.formBuilder.group({
      id: [null],
      taskName: [null, RequiredValidator],
      assignedTo: [null],
      state: [0],
      description: [null],
      acceptanceCriteria: [null],
      taskPoints: [null],
      readyForDevelopmentDate: [null],
      doneDate: [null],
      testingStartDate: [null],
      testingEndDate: [null],
      projectId: [this.projectId()],
    });
  }

  loadTask() {
    this.isLoading = true;

    this.taskService
      .getById(this.projectId(), this.id())
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((task) => {
        this.createEditTaskForm.patchValue(task, { emitEvent: false });
      });
  }

  onInputFocus(input: string) {
    switch (input) {
      case 'title':
        this.hoverdInputs.title = true;
        break;
      case 'assignedTo':
        this.hoverdInputs.assignedTo = true;
        break;
      case 'state':
        this.hoverdInputs.state = true;
        break;
    }
  }

  onInputBlur(input: string) {
    switch (input) {
      case 'title':
        this.hoverdInputs.title = false;
        break;
      case 'assignedTo':
        this.hoverdInputs.assignedTo = false;
        break;
      case 'state':
        this.hoverdInputs.state = false;
        break;
    }
  }

  save() {
    this.isLoading = true;
    this.spinnerTip = this.SPINNER_TIP.Creating.replace('{{1}}', 'Task');
    const payload = this.createEditTaskForm.getRawValue();

    this.taskService
      .save(payload, this.projectId())
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (task) => {
          if (task && this.id() === 0) {
            this.onSave.emit(task.taskIdNumber);
            return;
          }

          this.notificationService.create(
            'success',
            NOTIFICATION_TITLE.FormSuccess.replace('{{1}}', 'Task Updated'),
            this.genericUtilityService.formatMessage(NOTIFICATION_MESSAGE.FormUpdatedSuccess, [
              'task',
              'task',
              task.taskIdNumber,
            ]),
            {
              nzClass: 'form-notification',
              nzDuration: 5000,
            }
          );
          this.createEditTaskForm.patchValue(task, { emitEvent: false });
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

  get state(): AbstractControl | null | undefined {
    return this.createEditTaskForm?.get('state');
  }
}
