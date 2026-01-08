import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { EmailValidator, RequiredValidator } from '@app/shared/constants/validators';
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
import { Subject } from 'rxjs';

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
  ],
  templateUrl: './admin-edit-company.component.html',
  styleUrl: './admin-edit-company.component.scss',
})
export class AdminEditCompanyComponent implements OnInit, OnDestroy {
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly _destroying$ = new Subject<void>();

  editCompanyForm!: FormGroup;
  spinnerTip!: string;
  catchError!: any;

  isLoading = false;
  hasChanges = false;
  statusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.editCompanyForm = this.formBuilder.group({
      id: [null],
      name: [null, RequiredValidator],
      companyEmail: [null, [...RequiredValidator, EmailValidator]],
      isApproved: [null],
    });
  }

  close() {
    this.router.navigate([`/portal/admin/companies`]);
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
