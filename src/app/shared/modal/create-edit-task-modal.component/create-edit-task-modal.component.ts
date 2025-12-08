import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { QuillModule } from 'ngx-quill';

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
    QuillModule,
  ],
  templateUrl: './create-edit-task-modal.component.html',
  styleUrl: './create-edit-task-modal.component.scss',
})
export class CreateEditTaskModalComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private changeDetectorRef = inject(ChangeDetectorRef);

  createEditTaskForm!: FormGroup;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
    ],
  };
  descriptionTheme = 'bubble';
  showRichText = true;
  hideRichText = false;
  richTextSpan = 12;

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.createEditTaskForm = this.formBuilder.group({
      taskName: [null],
      assignedTo: [null],
      description: [null],
    });
  }

  onDescriptionFocus() {
    if (this.descriptionTheme === 'snow') return;

    this.descriptionTheme = 'snow';

    this.reRenderEditor();
    console.log('focus', this.descriptionTheme);
  }

  onDescriptionBlur() {
    if (this.descriptionTheme === 'bubble') return;

    this.descriptionTheme = 'bubble';

    this.reRenderEditor();
    console.log('blur', this.descriptionTheme);
  }

  private reRenderEditor() {
    this.showRichText = false;
    this.changeDetectorRef.detectChanges();
    this.showRichText = true;
  }
}
