import { Component, input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FIELD_ERROR } from '@app/shared/constants/messages';

@Component({
  selector: 'app-popover-form-validator-container',
  imports: [],
  templateUrl: './popover-form-validator-container.component.html',
  styleUrl: './popover-form-validator-container.component.scss',
})
export class PopoverFormValidatorContainerComponent implements OnInit {
  control = input<AbstractControl>();

  validators = Object.keys(FIELD_ERROR);
  validationMessages: Record<string, string> = FIELD_ERROR;

  ngOnInit() {
    console.log(this.control()?.hasError('minlength'));
    console.log(this.control());
    console.log(this.validationMessages)
  }
  // getErrorMessages(): string[] {
  //   const errs = this.errors();
  //   if (!errs) return [];
  //   const messages: string[] = [];
  //   if (errs['required']) messages.push('This field is required');
  //   if (errs['email']) messages.push('Invalid email format');
  //   if (errs['minlength'])
  //     messages.push(`Minimum ${errs['minlength'].requiredLength} characters required`);
  //   if (errs['maxlength'])
  //     messages.push(`Maximum ${errs['maxlength'].requiredLength} characters allowed`);
  //   for (const key in errs) {
  //     if (!['required', 'email', 'minlength', 'maxlength'].includes(key)) {
  //       messages.push(errs[key]?.message || key);
  //     }
  //   }
  //   return messages;
  // }
}
