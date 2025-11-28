import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export const RequiredValidator = [Validators.required, Validators.maxLength(255)];

export const EmailValidator = Validators.email;

export const PasswordValidators = [
  Validators.required,
  Validators.minLength(8),
  Validators.maxLength(50),
  namedPattern(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!"#$%&'()*+,-./:;<=>?@^_`{|}~[\]\\]).{8,}$/,
    'passwordPattern'
  ),
];

export function namedPattern(pattern: RegExp | string, errorKey: string): ValidatorFn {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

  return (control: AbstractControl) => {
    if (!control.value) return null;

    return regex.test(control.value) ? null : { [errorKey]: true };
  };
}
