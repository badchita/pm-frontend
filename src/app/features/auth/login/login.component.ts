import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
  showNotAuthAlert = false;

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['message'] === 'not-authenticated') {
        this.showNotAuthAlert = true;
        this.alertDetails = {
          type: 'error',
          message: ALERT_MESAGE.NotAuthorized,
          description: ALERT_DESCRIPTION.NotAuthorizedMessage,
        };
      }
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [...RequiredValidator, EmailValidator]],
      password: [null, PasswordValidators],
    });
  }

  login() {
    this.isLoading = true;
    this.showNotAuthAlert = false;
    const payload = this.loginForm.getRawValue();

    this.authService
      .login(payload)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.authService.setAccessToken(response.token);
          this.authService.setUserDetails(response.user);
          this.router.navigate(['/portal']);
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
