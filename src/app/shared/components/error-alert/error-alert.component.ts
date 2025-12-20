import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { ALERT_DESCRIPTION, ALERT_MESAGE } from '@app/shared/constants/ui.constants';
import { AlertType } from '@app/shared/models/alert.model';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-error-alert',
  imports: [NzAlertModule],
  templateUrl: './error-alert.component.html',
  styleUrl: './error-alert.component.scss',
})
export class ErrorAlertComponent implements OnChanges {
  error = input.required<any | AlertType>();

  alertDetails: AlertType | null = null;

  ALERT_MESAGE = ALERT_MESAGE;
  ALERT_DESCRIPTION = ALERT_DESCRIPTION;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['error'] && this.error()) {
      this.setAlert(this.error());
    }
  }

  private setAlert(error: any) {
    switch (error.status) {
      case 0:
        this.alertDetails = {
          type: 'error',
          message: this.ALERT_MESAGE.NoInternetConnection,
          description: this.ALERT_DESCRIPTION.PleaseCheckYourNetworkAndTryAgain,
        };
        break;
      case 401:
        this.alertDetails = {
          type: 'error',
          message: ALERT_MESAGE.LoginFailed,
          description: ALERT_DESCRIPTION.LoginFailedMessage,
        };
        break;
      case 409:
        this.alertDetails = {
          type: 'error',
          message: this.ALERT_MESAGE.EmailAlreadyExists,
          description: this.ALERT_DESCRIPTION.ThisEmailIsAlreadyInUse,
        };
        break;
      case 500:
        this.alertDetails = {
          type: 'error',
          message: this.ALERT_MESAGE.UnexpectedErroIinternalServerError,
          description: this.ALERT_DESCRIPTION.AnUnexpectedErrorOccurredPleaseTryAgainLater,
        };
        break;
      default:
        this.alertDetails = {
          type: 'error',
          message: ALERT_MESAGE.NotAuthorized,
          description: ALERT_DESCRIPTION.NotAuthorizedMessage,
        };
    }
  }
}
