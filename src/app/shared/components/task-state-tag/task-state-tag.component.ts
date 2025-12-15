import { Component, inject, input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TaskStateColorOptions } from '@app/shared/enums/task-state.enum';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-task-state-tag',
  imports: [NzTagModule],
  templateUrl: './task-state-tag.component.html',
  styleUrl: './task-state-tag.component.scss',
})
export class TaskStateTagComponent implements OnInit {
  readonly state = input.required<AbstractControl | null | undefined>();

  private genericUtilityService = inject(GenericUtilityService);

  color!: string;

  stateColorOptions = this.genericUtilityService.objectToArray(TaskStateColorOptions, false, true);

  ngOnInit() {
    this.stateColorOptions = this.stateColorOptions.map((stateColor: NzSelectOptionInterface) => {
      return { value: stateColor.value, color: stateColor.label };
    });
    this.color = this.genericUtilityService.getStateColor(this.state()?.value);

    this.state()?.valueChanges.subscribe((value) => {
      this.color = this.genericUtilityService.getStateColor(value);
    });
  }
}
