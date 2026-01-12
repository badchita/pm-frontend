import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '@app/features/admin/admin-companies/models/company.model';
import { CompanyService } from '@app/features/admin/admin-companies/services/company.service';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import {
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
  SPINNER_TIP,
} from '@app/shared/constants/ui.constants';
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
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectItemInterface, NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { finalize, forkJoin, Observable, Subject, takeUntil } from 'rxjs';

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
  private readonly companyService = inject(CompanyService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly _destroying$ = new Subject<void>();

  editUserForm!: FormGroup;
  spinnerTip!: string;
  catchError!: any;
  userStatus!: string;
  userCreated!: Date | string;
  originalUser: any;
  companies!: { label: string; value: number }[];
  disableFilter: (input: string, option: NzSelectItemInterface) => boolean = () => true;

  isLoading = false;
  roleOptions = this.genericUtilityService.objectToArray(UserRoleOptions, false, true);
  statusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);
  hasChanges = false;

  ngOnInit() {
    this.spinnerTip = SPINNER_TIP.loadingData;
    this.buildForm();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.loadData(id);
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

  loadData(id: string) {
    this.isLoading = true;

    forkJoin({
      user: this.userService.getById(+id),
      companies: this.loadCompanies({}),
    })
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: ({ user, companies }) => {
          this.userStatus = user.isApproved;
          this.userCreated = user.createdAt;
          this.originalUser = { ...user };
          this.editUserForm.patchValue(user, { emitEvent: false });
          this.editUserForm.markAsPristine();
          this.editUserForm.markAsUntouched();

          this.editUserForm.valueChanges.pipe(takeUntil(this._destroying$)).subscribe((value) => {
            this.hasChanges = Object.keys(value).some(
              (key) => value[key] !== this.originalUser[key]
            );
          });

          this.setCompanies(companies);        },
        error: (error) => {
          this.catchError = error;
        },
      });
  }

  loadCompanies(filter?: any): Observable<Company[]> {
    return this.companyService.getSearchCompanies(filter);
  }

  searchCompanies(searchValue: string) {
    this.loadCompanies({ search: searchValue })
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (companies) => {
          this.setCompanies(companies);
        },
      });
  }

  setCompanies(companies: Company[]) {
    this.companies = companies.map((company) => ({
      label: company.name,
      value: company.id,
    }));
  }

  close() {
    this.router.navigate([`/portal/admin/users`]);
  }

  save() {
    this.isLoading = true;
    this.spinnerTip = SPINNER_TIP.Updating.replace('{{1}}', 'user');
    const payload = this.editUserForm.getRawValue();

    this.userService
      .update(payload)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (user) => {
          this.notificationService.create(
            'success',
            NOTIFICATION_TITLE.FormSuccess.replace('{{1}}', 'User Updated'),
            NOTIFICATION_MESSAGE.FormUpdatedSuccess.replace('{{1}}', 'User'),
            {
              nzClass: 'form-notification',
              nzDuration: 5000,
            }
          );
          this.userStatus = user.isApproved;

          this.editUserForm.patchValue(user, { emitEvent: false });
          this.editUserForm.markAsPristine();
          this.editUserForm.markAsUntouched();
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
