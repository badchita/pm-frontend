import { ChangeDetectorRef, Component, inject, input, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QuillModule } from 'ngx-quill';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import Quill from 'quill';

@Component({
  selector: 'app-task-form-details',
  imports: [
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    QuillModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
  ],
  templateUrl: './task-form-details.component.html',
  styleUrl: './task-form-details.component.scss',
})
export class TaskFormDetailsComponent {
  @ViewChild('descriptionRef') descriptionRef!: any;
  @ViewChild('acceptanceCriteriaRef') acceptanceCriteriaRef!: any;

  taskDetailForm = input.required<FormGroup>();
  private changeDetectorRef = inject(ChangeDetectorRef);

  clearToolbarTimer: any;

  quillToolbar = [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ color: [] }, { background: [] }],
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
  richTextSpan = 13;
  hoverdInputs = {
    taskPoints: false,
    readyForDevelopmentDate: false,
    doneDate: false,
    testingStartDate: false,
    testingEndDate: false,
  };
  toolbarInteracting = false;

  onInputFocus(input: string) {
    switch (input) {
      case 'taskPoints':
        this.hoverdInputs.taskPoints = true;
        break;
      case 'readyForDevelopmentDate':
        this.hoverdInputs.readyForDevelopmentDate = true;
        break;
      case 'doneDate':
        this.hoverdInputs.doneDate = true;
        break;
      case 'testingStartDate':
        this.hoverdInputs.testingStartDate = true;
        break;
      case 'testingEndDate':
        this.hoverdInputs.testingEndDate = true;
        break;
      case 'description':
        if (this.descriptionTheme === 'snow') return;

        this.descriptionTheme = 'snow';

        this.reRenderEditor(input, false);
        break;
      case 'acceptanceCriteria':
        if (this.acceptanceCriteriaTheme === 'snow') return;

        this.acceptanceCriteriaTheme = 'snow';

        this.reRenderEditor(input, false);
        break;
    }
  }

  onEditorCreated(quill: Quill) {
    const toolbar = quill.getModule('toolbar') as any | null;

    if (!toolbar?.container) return;

    const toolbarEl = toolbar.container;

    toolbarEl.addEventListener('pointerdown', () => {
      this.toolbarInteracting = true;
      if (this.clearToolbarTimer) {
        clearTimeout(this.clearToolbarTimer);
      }
    });

    document.addEventListener('pointerup', () => {
      this.clearToolbarTimer = setTimeout(() => {
        this.toolbarInteracting = false;
      }, 0);
    });
  }

  onInputBlur(input: string) {
    if (this.toolbarInteracting) return;

    switch (input) {
      case 'taskPoints':
        this.hoverdInputs.taskPoints = false;
        break;
      case 'readyForDevelopmentDate':
        this.hoverdInputs.readyForDevelopmentDate = false;
        break;
      case 'doneDate':
        this.hoverdInputs.doneDate = false;
        break;
      case 'testingStartDate':
        this.hoverdInputs.testingStartDate = false;
        break;
      case 'testingEndDate':
        this.hoverdInputs.testingEndDate = false;
        break;
      case 'description':
        if (this.descriptionTheme === 'bubble') return;
        this.descriptionTheme = 'bubble';
        this.reRenderEditor(input, true);
        break;
      case 'acceptanceCriteria':
        if (this.acceptanceCriteriaTheme === 'bubble') return;
        this.acceptanceCriteriaTheme = 'bubble';
        this.reRenderEditor(input, true);
        break;
    }
  }

  expandMinimizeRichText(richText: string, isExpand: boolean) {
    if (richText === 'description') {
      this.richTextSpan = isExpand ? 24 : 13;
      this.hideOtherCol = isExpand;
      this.hideacceptanceCriteria = isExpand;
      return;
    }

    this.richTextSpan = isExpand ? 24 : 13;
    this.hideOtherCol = isExpand;
    this.hideDescription = isExpand;
  }

  private reRenderEditor(richTextInput: string, isBlur: boolean) {
    if (richTextInput === 'description') {
      this.showDescriptionRichText = false;
      this.changeDetectorRef.detectChanges();
      this.showDescriptionRichText = true;
      setTimeout(() => {
        if (isBlur) {
          this.descriptionRef = null;
          return;
        }
        if (this.descriptionRef) {
          const quill = this.descriptionRef.quillEditor;
          this.acceptanceCriteriaRef = null;
          quill.focus();
        }
      });
      return;
    }

    this.showAcceptanceCriteriaRichText = false;
    this.changeDetectorRef.detectChanges();
    this.showAcceptanceCriteriaRichText = true;
    setTimeout(() => {
      if (isBlur) {
        this.acceptanceCriteriaRef = null;
        return;
      }
      if (this.acceptanceCriteriaRef) {
        const quill = this.acceptanceCriteriaRef.quillEditor;
        quill.focus();
      }
    });
  }
}
