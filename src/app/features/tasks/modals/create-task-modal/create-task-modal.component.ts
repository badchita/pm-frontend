import { Component, inject, Inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { TaskFormComponent } from '../../components/task-form/task-form.component';

@Component({
  selector: 'app-create-edit-task-modal',
  imports: [TaskFormComponent],
  templateUrl: './create-task-modal.component.html',
  styleUrl: './create-task-modal.component.scss',
})
export class CreateTaskModalComponent {
  private modalRef = inject(NzModalRef);

  projectId!: number;

  constructor(@Inject(NZ_MODAL_DATA) data: { projectId: number }) {
    this.projectId = data.projectId;
  }

  onClickSave(taskIdNumber: string) {
    this.modalRef.close(taskIdNumber);
  }
}
