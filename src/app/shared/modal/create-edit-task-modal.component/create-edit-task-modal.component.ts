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

  quillToolbar = [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
  ];
  descriptionQuillmodules = {
    toolbar: this.quillToolbar,
  };
  acceptanceCriteriaQuillmodules = {
    toolbar: this.quillToolbar,
  };
  descriptionTheme = 'bubble';
  acceptanceCriteriaTheme = 'bubble';
  showDescriptionRichText = true;
  showAcceptanceCriteriaRichText = true;
  hideDescriptionRichText = false;
  hideDescription = false;
  hideacceptanceCriteriaRichText = false;
  hideacceptanceCriteria = false;
  hideOtherCol = false;
  richTextSpan = 12;
  hoverdInputs = {
    title: false,
    assignedTo: false,
    state: false,
  };

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.createEditTaskForm = this.formBuilder.group({
      taskName: [null],
      assignedTo: [null],
      state: [null],
      description: [null],
      acceptanceCriteria: [null],
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
      case 'description':
        if (this.descriptionTheme === 'snow') return;

        this.descriptionTheme = 'snow';

        this.reRenderEditor(input);
        break;
      case 'acceptanceCriteria':
        if (this.acceptanceCriteriaTheme === 'snow') return;

        this.acceptanceCriteriaTheme = 'snow';

        this.reRenderEditor(input);
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
      case 'description':
        if (this.descriptionTheme === 'bubble') return;

        this.descriptionTheme = 'bubble';

        this.reRenderEditor(input);
        break;
      case 'acceptanceCriteria':
        if (this.acceptanceCriteriaTheme === 'bubble') return;

        this.acceptanceCriteriaTheme = 'bubble';

        this.reRenderEditor(input);
        break;
    }
  }

  expandMinimizeRichText(richText: string, isExpand: boolean) {
    if (richText === 'description') {
      this.richTextSpan = isExpand ? 24 : 12;
      this.hideOtherCol = isExpand;
      this.hideacceptanceCriteria = isExpand;
      return;
    }

    this.richTextSpan = isExpand ? 24 : 12;
    this.hideOtherCol = isExpand;
    this.hideDescription = isExpand;
  }

  private reRenderEditor(richTextInput: string) {
    if (richTextInput === 'description') {
      this.showDescriptionRichText = false;
      this.changeDetectorRef.detectChanges();
      this.showDescriptionRichText = true;

      return;
    }

    this.showAcceptanceCriteriaRichText = false;
    this.changeDetectorRef.detectChanges();
    this.showAcceptanceCriteriaRichText = true;
  }
}
