import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FIELD_ERROR } from '@app/shared/constants/messages';

@Component({
  selector: 'app-popover-form-validator-container',
  imports: [],
  templateUrl: './popover-form-validator-container.component.html',
  styleUrl: './popover-form-validator-container.component.scss',
})
export class PopoverFormValidatorContainerComponent {
  control = input<AbstractControl>();

  validators = Object.keys(FIELD_ERROR);
  validationMessages: Record<string, string> = FIELD_ERROR;

  format(message: string, value: number): string {
    return message.replace('{{1}}', value?.toString() ?? '');
  }
}
