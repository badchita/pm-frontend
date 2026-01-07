import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmailValidator, RequiredValidator } from '@app/shared/constants/validators';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { UserStatusOptions } from '@app/shared/enums/search.enum';
import { UserRoleOptions } from '@app/shared/enums/user-role.enum';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';

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
  ],
  templateUrl: './admin-edit-user.component.html',
  styleUrl: './admin-edit-user.component.scss',
})
export class AdminEditUserComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly genericUtilityService = inject(GenericUtilityService);

  editUserForm!: FormGroup;
  spinnerTip!: string;

  isLoading = false;
  roleOptions = this.genericUtilityService.objectToArray(UserRoleOptions);
  statusOptions = this.genericUtilityService.objectToArray(UserStatusOptions);
  hasChanges = false;

  ngOnInit() {
    this.buildForm();
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
}
