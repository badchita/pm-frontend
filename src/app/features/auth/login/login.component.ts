import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ALERT_DESCRIPTION, ALERT_MESAGE, SPINNER_TIP } from '@app/shared/constants/ui.constants';
import {
  EmailValidator,
  PasswordValidators,
  RequiredValidator,
} from '@app/shared/constants/validators';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { AlertType } from '@app/shared/models/alert.model';
import { AuthService } from '@app/shared/services/api/auth.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardComponent,
    NzTypographyModule,
    RouterLink,
    NzSpinModule,
    NzAlertModule,
    PopoverFormValidatorDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  private _destroying$ = new Subject<void>();

  loginForm!: FormGroup;
  isLoading = false;

  SPINNER_TIP = SPINNER_TIP;
  ALERT_MESAGE = ALERT_MESAGE;
  ALERT_DESCRIPTION = ALERT_DESCRIPTION;

  alertDetails: AlertType = {
    type: 'info',
    message: '',
    description: '',
  };
  hasError = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [...RequiredValidator, EmailValidator]],
      password: ['', PasswordValidators],
    });
  }

  login() {
    this.isLoading = true;
    const payload = this.loginForm.getRawValue();

    this.authService
      .login(payload)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (response) => {
          this.isLoading = false;

          console.log('Login response:', response);
        },
        (error) => {
          this.isLoading = false;
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
}
