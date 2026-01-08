import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import {
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
  SPINNER_TIP,
} from '@app/shared/constants/ui.constants';
import { CompanyEmailValidators, RequiredValidator } from '@app/shared/constants/validators';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { UserStatusOptions } from '@app/shared/enums/search.enum';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { finalize, Subject, takeUntil } from 'rxjs';
import { CompanyService } from '../../services/company.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-admin-edit-company',
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
    NzIconModule,
    NzTooltipModule,
  ],
  templateUrl: './admin-edit-company.component.html',
  styleUrl: './admin-edit-company.component.scss',
})
export class AdminEditCompanyComponent implements OnInit, OnDestroy {
  private readonly companyService = inject(CompanyService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly _destroying$ = new Subject<void>();

  editCompanyForm!: FormGroup;
  spinnerTip!: string;
  catchError!: any;
  originalCompany!: any;
  companyStatus!: string;
  companyCreated!: Date | string;

  isLoading = false;
  hasChanges = false;
  statusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);

  ngOnInit() {
    this.spinnerTip = SPINNER_TIP.loadingData;

    this.buildForm();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.loadUser(id);
    });
  }

  buildForm() {
    this.editCompanyForm = this.formBuilder.group({
      id: [null],
      name: [null, RequiredValidator],
      companyEmail: [null, [...RequiredValidator, CompanyEmailValidators]],
      isApproved: [null],
    });
  }

  loadUser(id: string) {
    this.isLoading = true;

    this.companyService
      .getById(+id)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (company) => {
          this.companyStatus = company.isApproved;
          this.companyCreated = company.createdAt;
          this.originalCompany = { ...company };
          this.editCompanyForm.patchValue(company, { emitEvent: false });
          this.editCompanyForm.markAsPristine();
          this.editCompanyForm.markAsUntouched();

          this.editCompanyForm.valueChanges
            .pipe(takeUntil(this._destroying$))
            .subscribe((value) => {
              this.hasChanges = Object.keys(value).some(
                (key) => value[key] !== this.originalCompany[key]
              );
            });
        },
        error: (error) => {
          this.catchError = error;
        },
      });
  }

  close() {
    this.router.navigate([`/portal/admin/companies`]);
  }

  save() {
    this.isLoading = true;
    this.spinnerTip = SPINNER_TIP.Updating.replace('{{1}}', 'company');
    const payload = this.editCompanyForm.getRawValue();

    this.companyService
      .update(payload)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (company) => {
          this.notificationService.create(
            'success',
            NOTIFICATION_TITLE.FormSuccess.replace('{{1}}', 'Company Updated'),
            NOTIFICATION_MESSAGE.FormUpdatedSuccess.replace('{{1}}', 'Company'),
            {
              nzClass: 'form-notification',
              nzDuration: 5000,
            }
          );
          this.companyStatus = company.isApproved;

          this.editCompanyForm.patchValue(company, { emitEvent: false });
          this.editCompanyForm.markAsPristine();
          this.editCompanyForm.markAsUntouched();
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
