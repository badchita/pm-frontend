import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { TaskStateOptions } from '@app/shared/enums/task-state.enum';
import { TaskStateTagComponent } from '@app/shared/components/task-state-tag/task-state-tag.component';
import { RequiredValidator } from '@app/shared/constants/validators';
import { ProjectService } from '@app/features/projects/services/project.service';
import { ALERT_DESCRIPTION, ALERT_MESAGE, SPINNER_TIP } from '@app/shared/constants/ui.constants';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AlertType } from '@app/shared/models/alert.model';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TaskFormDetailsComponent } from '../../components/task-form-details/task-form-details.component';

@Component({
  selector: 'app-create-edit-task-modal',
  imports: [
    NzModalModule,
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
  templateUrl: './create-task-modal.component.html',
  styleUrl: './create-task-modal.component.scss',
})
export class CreateTaskModalComponent implements OnInit, OnDestroy {
  private genericUtilityService = inject(GenericUtilityService);
  private projectService = inject(ProjectService);
  private formBuilder = inject(FormBuilder);
  private modalRef = inject(NzModalRef);

  private _destroying$ = new Subject<void>();

  projectId!: number;
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

  constructor(@Inject(NZ_MODAL_DATA) data: { projectId: number }) {
    this.projectId = data.projectId;
  }

  ngOnInit() {
    this.buildForm();
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
      projectId: [this.projectId],
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
    this.spinnerTip = this.SPINNER_TIP.Creating.replace('{{1}}', 'Task');
    const payload = this.createEditTaskForm.getRawValue();

    this.projectService
      .saveTask(payload, this.projectId)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (task) => {
          if (task) {
            this.modalRef.close(task.taskIdNumber);
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

  get state(): AbstractControl | null | undefined {
    return this.createEditTaskForm?.get('state');
  }
}
