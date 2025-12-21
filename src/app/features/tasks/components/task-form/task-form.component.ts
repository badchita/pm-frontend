import { Component, inject, input, OnDestroy, OnInit, output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectItemInterface, NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { TaskStateOptions } from '@app/shared/enums/task-state.enum';
import { TaskStateTagComponent } from '@app/shared/components/task-state-tag/task-state-tag.component';
import { RequiredValidator } from '@app/shared/constants/validators';
import {
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
  SPINNER_TIP,
} from '@app/shared/constants/ui.constants';
import { finalize, forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TaskFormDetailsComponent } from '../../components/task-form-details/task-form-details.component';
import { TaskService } from '../../services/task.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { UserService } from '@app/shared/services/api/user.service';
import { User } from '@app/features/auth/models/user.model';
import { TaskFormHistoryComponent } from '../task-form-history/task-form-history.component';

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
    ErrorAlertComponent,
    TaskFormHistoryComponent,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit, OnDestroy {
  @ViewChild(TaskFormDetailsComponent) taskFormDetails!: TaskFormDetailsComponent;
  @ViewChild(TaskFormHistoryComponent) taskFormHistory!: TaskFormHistoryComponent;

  readonly projectId = input.required<number>();
  readonly id = input.required<number>();
  readonly onSave = output<string>();
  readonly onGetTaskIdNumber = output<string>();

  private genericUtilityService = inject(GenericUtilityService);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private notificationService = inject(NzNotificationService);
  private formBuilder = inject(FormBuilder);

  private _destroying$ = new Subject<void>();

  createEditTaskForm!: FormGroup;
  spinnerTip!: string;
  catchError!: any;
  users!: { label: string; value: string }[];
  disableFilter: (input: string, option: NzSelectItemInterface) => boolean = () => true;
  totalComments!: number | null;

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
  SPINNER_TIP = SPINNER_TIP;
  NOTIFICATION_TITLE = NOTIFICATION_TITLE;
  NOTIFICATION_MESSAGE = NOTIFICATION_MESSAGE;

  ngOnInit() {
    this.buildForm();

    if (this.id() > 0) {
      this.loadData();
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

  loadData() {
    this.isLoading = true;

    forkJoin({
      task: this.taskService.getById(this.projectId(), this.id()),
      users: this.loadUsers(),
    })
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: ({ task, users }) => {
          this.createEditTaskForm.patchValue(task);
          this.onGetTaskIdNumber.emit(task.taskIdNumber);

          this.users = this.setUsersOptions(users);
        },
        error: (error) => {
          this.catchError = error;
        },
      });
  }

  loadUsers(filter?: any): Observable<User[]> {
    return this.userService.getSearchUsers(filter);
  }

  assignedToSearch(searchValue: string) {
    this.loadUsers({ search: searchValue })
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((users) => {
        this.users = this.setUsersOptions(users);
      });
  }

  setUsersOptions(users: User[]): { label: string; value: string }[] {
    return users.map((user) => {
      return {
        label: user.name,
        value: user.email,
      };
    });
  }

  handleInputFocusBlur(input: string, isFocus = false) {
    const hoverStateMap: Record<string, keyof typeof this.hoverdInputs> = {
      title: 'title',
      assignedTo: 'assignedTo',
      state: 'state',
    };

    if (hoverStateMap[input]) {
      this.hoverdInputs[hoverStateMap[input]] = isFocus;
      return;
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

          this.taskFormHistory.loadHistories();
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
          this.catchError = error;
        }
      );
  }

  refresh() {
    if (this.id() > 0) {
      this.loadData();
      this.taskFormHistory.loadHistories();
    }
  }

  getTotalComments(totalComments: number | null) {
    this.totalComments = totalComments;
  }

  scrollToDiscussions() {
    this.taskFormDetails.scrollToDiscussions();
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  get state(): AbstractControl | null | undefined {
    return this.createEditTaskForm?.get('state');
  }
}
