import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CreateEditTaskDetailsComponent } from './components/create-edit-task-details/create-edit-task-details.component';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { TaskStateOptions } from '@app/shared/enums/task-state.enum';

@Component({
  selector: 'app-create-edit-task-modal',
  imports: [
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    PopoverFormValidatorDirective,
    NzSelectModule,
    NzGridModule,
    NzTypographyModule,
    NzTabsModule,
    CreateEditTaskDetailsComponent,
  ],
  templateUrl: './create-edit-task-modal.component.html',
  styleUrl: './create-edit-task-modal.component.scss',
})
export class CreateEditTaskModalComponent implements OnInit {
  private genericUtilityService = inject(GenericUtilityService);
  private formBuilder = inject(FormBuilder);

  createEditTaskForm!: FormGroup;

  hoverdInputs = {
    title: false,
    assignedTo: false,
    state: false,
  };
  tabs = [
    {
      name: 'Details',
    },
    {
      icon: 'redo',
    },
  ];
  stateOptions = this.genericUtilityService.objectToArray(TaskStateOptions, false, true);

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.createEditTaskForm = this.formBuilder.group({
      taskName: [null],
      assignedTo: [null],
      state: [0],
      description: [null],
      acceptanceCriteria: [null],
      taskPoints: [null],
      readyForDevelopmentDate: [null],
      doneDate: [null],
      testingStartDate: [null],
      testingEndDate: [null],
    });
  }

  onInputFocus(input: string) {
    switch (input) {
      case 'title':
        this.hoverdInputs.title = true;
        break;
      case 'assignedTo':
        this.hoverdInputs.assignedTo = true;
        break;
      case 'state':
        this.hoverdInputs.state = true;
        break;
    }
  }

  onInputBlur(input: string) {
    switch (input) {
      case 'title':
        this.hoverdInputs.title = false;
        break;
      case 'assignedTo':
        this.hoverdInputs.assignedTo = false;
        break;
      case 'state':
        this.hoverdInputs.state = false;
        break;
    }
  }

  save() {
    console.log(this.createEditTaskForm.value);
  }
}
