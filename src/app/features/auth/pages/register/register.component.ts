import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import {
  ALERT_DESCRIPTION,
  ALERT_MESAGE,
  MODAL_TITLE,
  SPINNER_TIP,
} from '@app/shared/constants/ui.constants';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AlertType } from '@app/shared/models/alert.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import {
  EmailValidator,
  PasswordValidators,
  RequiredValidator,
} from '@app/shared/constants/validators';

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
    NzAlertModule,
    NzModalModule,
    PopoverFormValidatorDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private modalService = inject(NzModalService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private _destroying$ = new Subject<void>();

  registerForm!: FormGroup;

  SPINNER_TIP = SPINNER_TIP;
  ALERT_MESAGE = ALERT_MESAGE;
  ALERT_DESCRIPTION = ALERT_DESCRIPTION;
  MODAL_TITLE = MODAL_TITLE;

  alertDetails: AlertType = {
    type: 'info',
    message: '',
    description: '',
  };
  hasError = false;
  isLoading = false;

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: [null, [...RequiredValidator]],
      email: [null, [...RequiredValidator, EmailValidator]],
      password: [null, PasswordValidators],
    });
  }

  register() {
    this.hasError = false;
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
      .subscribe(
        (response) => {
          this.hasError = false;

          if (response) {
            this.registerSucessful(response.name);
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
            case 409:
              this.alertDetails = {
                type: 'error',
                message: ALERT_MESAGE.EmailAlreadyExists,
                description: ALERT_DESCRIPTION.ThisEmailIsAlreadyInUse,
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
}
