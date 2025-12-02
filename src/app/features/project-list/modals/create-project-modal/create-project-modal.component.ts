import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProjectListService } from '../../services/project-list.service';
import { Subject, takeUntil } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SPINNER_TIP } from '@app/shared/constants/ui.constants';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-project-modal',
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzSpinModule],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.scss',
})
export class CreateProjectModalComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private projectListService = inject(ProjectListService);
  private modalRef = inject(NzModalRef);

  private _destroying$ = new Subject<void>();

  createProjectForm!: FormGroup;
  isLoading = false;
  SPINNER_TIP = SPINNER_TIP;

  ngOnInit() {
    this.createProjectForm = this.formBuilder.group({
      projectName: [''],
      description: [''],
    });
  }

  reset() {
    this.createProjectForm.reset();
  }

  create() {
    this.isLoading = true;
    const payload = this.createProjectForm.getRawValue();

    this.projectListService
      .create(payload)
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        this.isLoading = false;

        if (response) {
          this.modalRef.close();
        }
      });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
