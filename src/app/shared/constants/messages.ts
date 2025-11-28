export const MESSAGE = {
  ACCOUNT_RECOVERY_TITLE: 'Account Recovery',
  ADDRESS_UPDATED: 'Delivery Address has been updated.',
  CHANGE_EMAIL_TITLE: 'Change Email Address',
  CHANGE_MOBILE_TITLE: 'Change Mobile Number',
  CHANGE_PASSWORD_TITLE: 'Change Password',
  CHECKOUT_FAILED: 'Checkout Failed',
  CHECKOUT_TITLE_SUCCESS: 'CTC Requests checkout successful.',
  CONFIRM_CHANGE_PASSWORD:
    'You will be redirected to Change Password page, any changes you have made will be discarded.<br><br>' +
    'Are you sure you want to continue?',
  CONFIRM_DELETE_TITLE: 'Are you sure you want to delete this title?',
  CONFIRM_EMAIL_UPDATE: 'Are you sure you want to change your email address?',
  CONFIRM_MOBILE_UPDATE: 'Are you sure you want to change your mobile number?',
  CONFIRM_REQUEST_TITLE_AGAIN: 'Are you sure you want to request these titles again?',
  CONFIRM_UPDATE_PROFILE: 'Are you sure you want to update your profile information?',
  CONFIRM_WITHDRAW_CTC_REQUESTS:
    'All CTC requests will be cancelled. Are you sure you want to proceed?',
  CONFIRM_RECEIVED:
    'Please make sure that you were able to receive your request successfully, with the correct information, and in satisfactory condition before confirming receipt.',
  CONFIRMATION: 'Confirmation',
  CTC_REQUEST_DUPLICATE_ERROR: 'Please input additional required details.',
  CTC_REQUEST_VALIDATION_ERROR:
    'Title is currently not in our database. You may please visit the Registry of Deeds ' +
    'or contact us via helpdesk.eserbisyo@lra.gov.ph for assistance.',
  DELETE_TITLE_SUCCESS: 'CTC Request has been deleted.',
  DORMANT_ACCOUNT_STATUS:
    'This account is now disabled due to inactivity for the past {n} days. ' +
    'Please contact the administrator for inquiries.',
  DORMANT_ACCOUNT_TITLE: 'Dormant Account',
  DOWNLOAD_SUCCESS: 'File successfully downloaded.',
  ENTER_NEW_RD_NEW_TITLE_NUMBER: 'Enter New Registry of Deeds and New Title Number.',
  ESERBISYO_TITLE_REQUEST: 'eSerbisyo Title Request',
  EXISTING_SESSION:
    'You have an existing session in IP address {item} that may still be open. Would you like to close that session and proceed with this new log in?',
  EXPIRED_ACCOUNT_STATUS:
    'Your account has expired, due to not being verified/activated 15 DAYS after account creation. Please register again!',
  EXPIRED_ACCOUNT_TITLE: 'Your account has expired',
  INVALID_NEWSLETTER_OTP: 'The OTP you have entered is incorrect',
  INVALID_OTP: 'Invalid OTP.',
  INVALID_REQUEST_STATUS: 'Application Status is invalid.',
  LOCKED_ACCOUNT_FORGOT_PASSWORD_STATUS:
    'Your account is currently locked. A link to unblock your account was sent to your email.',
  LOCKED_ACCOUNT_FORGOT_PASSWORD_TITLE: 'Account is Locked',
  LOCKED_ACCOUNT_STATUS:
    'Your account has been locked out due to failed consecutive login attempts. A link to unblock your account was sent to your email.',
  LOCKED_ACCOUNT_TITLE: 'Account is Locked',
  MARKETING_EMAILS_SUBSCRIPTION_REQUIRED:
    'You must accept the marketing and email updates to subscribe.',
  MY_PROFILE_TITLE: 'My Profile',
  NEWS_LETTER_SUBSCRIPTION_EMAIL_EXISTING_TITLE: 'Email Address Subscribed.',
  NEWS_LETTER_SUBSCRIPTION_EMAIL_EXISTING: 'Email Address is already subscribed.',
  NOT_FIRST_TIME_REQUESTOR: 'Promo code is only valid for first time requestors.',
  OTP_DISABLED:
    'OTP has been disabled due to x1 (x2) consecutive failed attempts. Please get a new OTP.',
  OTP_HAS_EXPIRED: 'OTP has expired.',
  OTP_DID_NOT_RECEIVE: "Didn't receive a code?",
  OTP_REQUIRED: 'OTP is required.',
  PASSWORD_REQUIRED: 'Please input your password.',
  PENDING_ACCOUNT_STATUS:
    '<br>Your account is NOT activated yet. ' +
    'To help you complete the registration process, an email has been sent to the email address you provided with an account activation link. ' +
    'Please click the link and you shall be redirected to the final registration page. ' +
    'Thank you.',
  PENDING_ACCOUNT_TITLE: 'Account Not Activated',
  PRIVACY_SUBSCRIPTION_REQUIRED: 'You must accept the consent of Privacy Notice to subscribe.',
  PROMO_DOES_NOT_EXIST: 'Promo code does not exist',
  RECAPTCHA_REQUIRED: 'Please click the reCAPTCHA.',
  RECOVERY_EMAIL_SENT: 'A link has been forwarded to your registered email address.',
  REQUEST_EXISTING: 'This title has already been selected. Please input another title.',
  REQUEST_TITLE_SUCCESS: 'CTC Request has been saved.',
  RESEND_OTP_NEWSLETTER_SUCCESSFUL: 'We have sent you an OTP to your registered email.',
  RESEND_OTP_SUCCESSFUL: 'We have sent you an OTP to your registered email/mobile number.',
  RESET_PASSWORD_SUCCESSFUL:
    'The password was successfully recovered! You are required to log in again.',
  SEND_PAYMENT_LINK_INFO:
    'You have opted to pay for this transaction at a later time. ' +
    'Should you wish to make payment, you may access this transaction in the "My Transactions" page or ' +
    'through the payment link forwarded to your registered email address or mobile number.',
  SERVER_ERROR: 'A server error encountered.',
  SESSION_EXISTS_TITLE: 'Active Session',
  SESSION_EXISTS: 'Log in cannot proceed. You have an existing session that may still be open.',
  SESSION_EXPIRED_MINUTES:
    'You have been logged out because you were idle for more than x minute(s).',
  SESSION_EXPIRED: 'Session Expired',
  SESSION_EXPIRY_WARNING:
    'If user clicks on “Yes”, the session shall be continued and wait for the action of the user.',
  TERMS_REQUIRED: 'You must accept the Terms and Conditions to register an account.',
  UNEXPECTED_ERROR: 'Unexpected error occurred.',
  UPDATE_EMAIL_SUCCESSFUL: 'You have successfully changed your email address.',
  UPDATE_MOBILE_SUCCESSFUL: 'You have successfully changed your mobile number.',
  UPDATE_PASSWORD_SUCCESSFUL: 'Your password has been changed successfully.',
  UPDATE_PROFILE_ADDRESS: 'Do you also want to update Delivery Address in your Profile?',
  UPDATE_PROFILE_SUCCESSFUL: 'Profile information update has been done successfully.',
  USER_ACTIVATION_SUCCESSFUL: 'Your account has been successfully activated.',
  USER_ACTIVATION_TITLE: 'Account Activation',
  USER_REGISTRATION_EMAIL_EXISTING: 'Email Address is already registered.',
  USER_REGISTRATION_MOBILE_EXISTING: 'Mobile Number is already registered.',
  USER_REGISTRATION_SUCCESSFUL:
    'User registration has been done successfully. ' +
    'An activation link has been forwarded to your registered email address.',
  USER_REGISTRATION_TITLE: 'User Registration',
  USER_REGISTRATION_USERNAME_EXISTING: 'Username is taken. Try another.',
  USERNAME_REQUIRED: 'Please input your username.',
  WARNING: 'Warning',
};

export const FIELD_ERROR = {
  alphaNumeric: 'Only alphanumeric characters are allowed.',
  alphaNumericWithDash: 'Value may contain alphanumeric and dash characters.',
  alphaNumericWithSpace: 'Value may contain alphanumeric and space characters.',
  alphaNumericWithSpaceAndDash: 'Value may contain alphanumeric, dash and space characters.',
  alphaNumericWithSpaceAndDashAndApostrophe:
    'Value may contain alphanumeric, dash, space, and apostrophe characters.',
  alphaNumericWithSpecialCharacters: 'Value may contain alphanumeric ( ) , . Ñ ñ - characters.',
  compare: '',
  different: '',
  email: 'Enter a valid email address.',
  emailExisting: MESSAGE.USER_REGISTRATION_EMAIL_EXISTING,
  emailsMismatch: 'Email address do not match.',
  greaterThan: 'Enter value greater than {{1}}.',
  isGreaterThanTo: 'From must not be greater than To.',
  lessThan: 'Enter value less than {{1}}.',
  maxLength: 'Maximum length is {{1}} characters.',
  maxNumber: 'Enter value not greater than {{1}}.',
  minlength: 'Enter minimum length of {{1}} characters.',
  minNumber: 'Enter value not less than {{1}}.',
  mobileNumberExisting: MESSAGE.USER_REGISTRATION_MOBILE_EXISTING,
  mobileNumberMismatch: 'Mobile numbers do not match.',
  mobileNumberPattern: 'Enter a valid mobile number.',
  newEmailAddressIsEqualToCurrent: 'Current and new email address must be different.',
  newMobileNumberIsEqualToCurrent: 'Current and new mobile number must be different.',
  newsLetterEmailExisting: MESSAGE.NEWS_LETTER_SUBSCRIPTION_EMAIL_EXISTING,
  numeric: 'Only numbers are allowed.',
  passwordPattern: 'Must contain letters, numbers, and special characters.',
  passwordsMismatch: 'Passwords do not match.',
  passwordTooShort: 'Use 8 characters or more for your password.',
  projectNameUnitNoEquals: 'Project Name and Unit No cannot be the same value.',
  required: 'This field is required.',
  usernameAndPasswordIsSame: 'Password and Username cannot be the same.',
  usernameExisting: MESSAGE.USER_REGISTRATION_USERNAME_EXISTING,
  usernamePattern: 'Enter a valid username',
  usernameTooShort: 'Use 8 characters or more for your username.',
  validDecimalNumber: 'Enter a valid numeric value (up to 2 decimal places).',
};
