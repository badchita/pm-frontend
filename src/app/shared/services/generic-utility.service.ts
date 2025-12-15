import { Injectable } from '@angular/core';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { TaskStateColorOptions, TaskStateOptions } from '../enums/task-state.enum';

@Injectable({
  providedIn: 'root',
})
export class GenericUtilityService {
  public objectToArray(
    obj: any,
    humanize = false,
    valueAsNumber = false
  ): NzSelectOptionInterface[] | any {
    return Object.keys(obj).map((key) => {
      const label = humanize ? obj[key].replace(/_/g, ' ') : obj[key];
      return { label, value: valueAsNumber ? Number(key) : key };
    });
  }

  public formatMessage(template: string, values: Array<string | number>): string {
    return template.replace(/\{\{(\d+)\}\}/g, (_, index) => {
      return values[Number(index) - 1]?.toString() ?? '';
    });
  }

  public getStateColor(state: number): string {
    const stateColorOptions = this.objectToArray(TaskStateColorOptions, false, true);
    const stateColors = stateColorOptions.map((stateColor: NzSelectOptionInterface) => {
      return { value: stateColor.value, color: stateColor.label };
    });
    const stateIndex = stateColors.findIndex((stateColor: NzSelectOptionInterface) => {
      return stateColor.value === state;
    });

    return stateColors[stateIndex].color;
  }

  getStateText(state: number): string {
    const stateOptions = this.objectToArray(TaskStateOptions, false, true);

    const stateIndex = stateOptions.findIndex((stateColor: NzSelectOptionInterface) => {
      return stateColor.value === state;
    });

    return stateOptions[stateIndex].label;
  }
}
