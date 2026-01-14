import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MODAL_TITLE, SPINNER_TIP } from '@app/shared/constants/ui.constants';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import {
  EmailValidator,
  PasswordValidators,
  RequiredValidator,
} from '@app/shared/constants/validators';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { UserRole } from '@app/shared/enums/user-role.enum';

@Component({
  selector: 'app-register',
  imports: [
    NzCardComponent,
    NzColDirective,
    NzInputModule,
    NzButtonComponent,
    ReactiveFormsModule,
    NzFormModule,
    NzTypographyComponent,
    RouterLink,
    NzSpinModule,
    NzModalModule,
    PopoverFormValidatorDirective,
    ErrorAlertComponent,
    NzSegmentedModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(NzModalService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly _destroying$ = new Subject<void>();

  registerForm!: FormGroup;
  catchError!: any;

  SPINNER_TIP = SPINNER_TIP;
  MODAL_TITLE = MODAL_TITLE;
  isLoading = false;
  userRoleOptions = [
    { value: UserRole.Member, label: 'Member' },
    { value: UserRole.Manager, label: 'Manager' },
  ];

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: [null, [...RequiredValidator]],
      email: [null, [...RequiredValidator, EmailValidator]],
      password: [null, PasswordValidators],
      role: [0, RequiredValidator],
    });

    this.role?.valueChanges.subscribe((value) => {
      if (value === UserRole.Manager) {
        this.registerForm.addControl('companyName', this.fb.control(null, [...RequiredValidator]));
      } else {
        this.registerForm.removeControl('companyName');
      }

      this.registerForm.updateValueAndValidity();
    });
  }

  register() {
    this.isLoading = true;
    const payload = this.registerForm.getRawValue();

    this.authService
      .register(payload)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.registerSucessful(response.name);
          }
        },
        error: (error) => {
          this.catchError = error;
        },
      });
  }

  registerSucessful(name: string) {
    this.modalService.success({
      nzTitle: this.MODAL_TITLE.AccountCreated,
      nzContent: `Welcome, ${name}. Your registration is complete. Please proceed to login using your email and password.`,
      nzClassName: 'register-success-modal',
      nzOkText: 'Proceed to Login',
      nzOnOk: () => {
        this.router.navigate(['/login']);
      },
    });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  get role(): AbstractControl | null | undefined {
    return this.registerForm?.get('role');
  }
}
