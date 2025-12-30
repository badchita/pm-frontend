export const SPINNER_TIP = {
  CreatingYourAccount: 'Creating your account...',
  LoggingYouIn: 'Logging you in...',
  Creating: 'Creating {{1}}...',
  Updating: 'Updating {{1}}...',
  loadingData: 'Loading data...',
  Adding: 'Adding {{1}}...',
};

export const ALERT_MESAGE = {
  EmailAlreadyExists: 'Email Already Exists',
  UnexpectedErroIinternalServerError: 'Unexpected error / internal server error',
  NoInternetConnection: 'No Internet Connection',
  LoginFailed: 'Login Failed',
  NotAuthorized: 'Not Authorized',
};

export const ALERT_DESCRIPTION = {
  ThisEmailIsAlreadyInUse: 'This email is already in use.',
  AnUnexpectedErrorOccurredPleaseTryAgainLater:
    'An unexpected error occurred. Please try again later.',
  PleaseCheckYourNetworkAndTryAgain: 'Please check your network and try again.',
  LoginFailedMessage:
    'The email or password you entered is incorrect. Please try again or reset your password if you’ve forgotten it',
  NotAuthorizedMessage: 'You must be logged in to access this page. Please log in and try again.',
};

export const MODAL_TITLE = {
  AccountCreated: '🎉 Account Successfully Created',
  SoftDeleteConfirmation: 'Delete {{1}}',
  RestoreConfirmation: 'Restore {{1}}',
  PermanentlyDeleteConfirmation: 'Permanently Delete {{1}}',
};

export const MODAL_DESCRIPTION = {
  SoftDeleteConfirmationMessage:
    'This {{1}} will be moved to the Recycle Bin and can be restored later.',
  RestoreConfirmationMessage:
    'This {{1}} will be restored from the Recycle Bin and will be active again.',
  PermanentlyDeleteConfirmationMessage:
    'This action will permanently delete the project and all related data.',
};

export const NOTIFICATION_TITLE = {
  FormSuccess: '{{1}} Successfully',
  SoftDeleteSuccess: '{{1}} Moved to Recycle Bin',
  RestoreSuccess: '{{1}} Restored Successfully',
  PermanentlyDeleteSuccess: '{{1}} Permanently Deleted',
};

export const NOTIFICATION_MESSAGE = {
  FormCreatedSuccess: 'The {{1}} was created and saved successfully. Your {{2}} ID is {{3}}.',
  FormUpdatedSuccess: '{{1}} was updated successfully.',
  ProjectFormPublishedSuccess: '{{1}} was published successfully.',
  ProjectFormDeactivatedSuccess: '{{1}} was deactivated successfully.',
  SoftDeleteMessageSuccess: 'The {{1}}  has been removed from the active list',
  RestoreMessageSuccess:
    'The {{1}} has been restored to the active list and is now available for normal use.',
  PermanentlyDeleteMessageSuccess:
    'The {{1}} and all its related data have been permanently removed from the system.',
};

export const STATE_HISTORY_LABEL = {
  MovedTo: 'Task moved {{1}} to',
  Set: 'State set to',
};
