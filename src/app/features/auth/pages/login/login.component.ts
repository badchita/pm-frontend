import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SPINNER_TIP } from '@app/shared/constants/ui.constants';
import {
  EmailValidator,
  PasswordValidators,
  RequiredValidator,
} from '@app/shared/constants/validators';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';

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
    PopoverFormValidatorDirective,
    ErrorAlertComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly _destroying$ = new Subject<void>();

  loginForm!: FormGroup;
  catchError!: any;

  SPINNER_TIP = SPINNER_TIP;
  isLoading = false;

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['message'] === 'not-authenticated') {
        this.catchError = 'not-authenticated';
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
    const payload = this.loginForm.getRawValue();

    this.authService
      .login(payload)
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response)
          const { token, user, refreshToken } = response;
          this.authService.setAccessToken(token);
          this.authService.setUserDetails(user);
          this.authService.setRefreshToken(refreshToken);
          this.authService.setUserRole(user.role);

          this.router.navigate(['/portal']);
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
