import { Component, InjectionToken, input, TemplateRef } from '@angular/core';

export type PopoverFormData = string | number | TemplateRef<void>;
export const POPOVER_FORM_DATA = new InjectionToken<PopoverFormData>('Data to display');
@Component({
  selector: 'app-popover-form-validator-container',
  imports: [],
  templateUrl: './popover-form-validator-container.component.html',
  styleUrl: './popover-form-validator-container.component.scss',
})
export class PopoverFormValidatorContainerComponent {
  errors = input<any>();
  getErrorMessages(): string[] {
    const errs = this.errors();
    if (!errs) return [];
    const messages: string[] = [];
    if (errs['required']) messages.push('This field is required');
    if (errs['email']) messages.push('Invalid email format');
    if (errs['minlength'])
      messages.push(`Minimum ${errs['minlength'].requiredLength} characters required`);
    if (errs['maxlength'])
      messages.push(`Maximum ${errs['maxlength'].requiredLength} characters allowed`);
    for (const key in errs) {
      if (!['required', 'email', 'minlength', 'maxlength'].includes(key)) {
        messages.push(errs[key]?.message || key);
      }
    }
    return messages;
  }
}
