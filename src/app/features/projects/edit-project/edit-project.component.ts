import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PopoverFormValidatorDirective } from '@app/shared/directives/popover-form-validator.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-edit-project',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    PopoverFormValidatorDirective,
    NzDatePickerModule,
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss',
})
export class EditProjectComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  editProjectForm!: FormGroup;

  ngOnInit() {
    this.editProjectForm = this.formBuilder.group({
      id: [null],
      projectIdNumber: [null],
      projectName: [null],
      description: [null],
      createdBy: [null],
      isPublished: [null],
      isDeleted: [null],
      createdAt: [null],
      progress: [null],
      dueDate: [null],
    });
  }
}
