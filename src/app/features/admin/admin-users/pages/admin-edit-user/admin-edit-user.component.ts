import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { EmailValidator, RequiredValidator } from '@app/shared/constants/validators';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { UserStatusOptions } from '@app/shared/enums/search.enum';
import { UserRoleOptions } from '@app/shared/enums/user-role.enum';
import { UserService } from '@app/shared/services/api/user.service';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-edit-user',
  imports: [
    NzSpinModule,
    NzTagModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzGridModule,
    PopoverFormValidatorDirective,
    NzSelectModule,
    NzButtonModule,
    ErrorAlertComponent,
    DatePipe,
  ],
  templateUrl: './admin-edit-user.component.html',
  styleUrl: './admin-edit-user.component.scss',
})
export class AdminEditUserComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  private readonly _destroying$ = new Subject<void>();

  editUserForm!: FormGroup;
  spinnerTip!: string;
  catchError!: any;
  userStatus!: string;
  userCreated!: Date | string;

  isLoading = false;
  roleOptions = this.genericUtilityService.objectToArray(UserRoleOptions, false, true);
  statusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);
  hasChanges = false;

  ngOnInit() {
    this.buildForm();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.loadUser(id);
    });
  }

  buildForm() {
    this.editUserForm = this.formBuilder.group({
      id: [null],
      name: [null, RequiredValidator],
      email: [null, [...RequiredValidator, EmailValidator]],
      isApproved: [null],
      role: [null, RequiredValidator],
      companyId: [null],
    });
  }

  loadUser(id: string) {
    this.isLoading = true;

    this.userService
      .getById(+id)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (user) => {
          this.userStatus = user.isApproved;
          this.userCreated = user.createdAt;
          this.editUserForm.patchValue(user, { emitEvent: false });
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
