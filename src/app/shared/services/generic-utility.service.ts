import { Injectable } from '@angular/core';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';

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
}
