import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '@app/features/projects/models/project.model';
import { DataTable } from '@app/shared/models/data-table.model';
import { DatePipe, I18nPluralPipe } from '@angular/common';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { StatusOptions } from '@app/shared/enums/search.enum';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import {
  MODAL_DESCRIPTION,
  MODAL_TITLE,
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
} from '@app/shared/constants/ui.constants';
import { ProjectService } from '@app/features/projects/services/project.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-project-list-table',
  imports: [
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule,
    NzTooltipModule,
    I18nPluralPipe,
    DatePipe,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzButtonModule,
    NzSelectModule,
    NzTagModule,
    NzModalModule,
  ],
  templateUrl: './project-list-table.component.html',
  styleUrl: './project-list-table.component.scss',
})
export class ProjectListTableComponent implements OnInit, OnDestroy {
  readonly dataTable = input.required<DataTable<Project>>();
  readonly dataList = input.required<Project[] | []>();
  readonly loading = input.required<boolean>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private readonly projectService = inject(ProjectService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly modalService = inject(NzModalService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly _destroying$ = new Subject<void>();

  searchProjectForm!: FormGroup;

  showTooltipDescription = false;
  statusOptions = this.genericUtilityService.objectToArray(StatusOptions);
  isDeleted = 'N';

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['isDeleted'] === 'Y') {
        this.isDeleted = params['isDeleted'];
      }
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchProjectForm = this.formBuilder.group({
      search: [null],
      dueDate: [null],
      isPublished: [null],
    });

    this.searchProjectForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchProjectForm
      .get('dueDate')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchProjectForm
      .get('isPublished')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());
  }

  checkOverflow(el: HTMLElement) {
    this.showTooltipDescription = el.scrollWidth > el.clientWidth;
  }

  edit(id: number) {
    this.router.navigate([`/portal/projects/${id}`]);
  }

  updateTable(params?: NzTableQueryParams) {
    const searchFormValues = this.searchProjectForm.getRawValue();
    const isFiltering =
      searchFormValues.search || searchFormValues.description || searchFormValues.dueDate;
    const filter: NzTableQueryParams['filter'] = [
      { ...searchFormValues, isDeleted: this.isDeleted },
    ];

    const tableParams: NzTableQueryParams = {
      pageIndex: isFiltering ? 1 : (params?.pageIndex ?? this.dataTable().page),
      pageSize: params?.pageSize ?? this.dataTable().pageSize,
      sort: params?.sort ?? [],
      filter: filter,
    };

    this.onUpdateTable.emit(tableParams);
  }

  recycleBin(event: MouseEvent, isOpen = 'N') {
    event.stopPropagation();
    this.isDeleted = isOpen;
    if (isOpen === 'Y') {
      this.router.navigate([`/portal/projects`], { queryParams: { isDeleted: 'Y' } });
    } else {
      this.router.navigate([`/portal/projects`]);
    }

    this.updateTable();
  }

  deleteRestoreProject(id: number, isDeleted: string) {
    const modalTitle =
      isDeleted === 'Y'
        ? MODAL_TITLE.SoftDeleteConfirmation.replace('{{1}}', 'project')
        : MODAL_TITLE.RestoreConfirmation.replace('{{1}}', 'project');
    const modaDescription =
      isDeleted === 'Y'
        ? MODAL_DESCRIPTION.SoftDeleteConfirmationMessage.replace('{{1}}', 'project')
        : MODAL_DESCRIPTION.RestoreConfirmationMessage.replace('{{1}}', 'project');

    this.modalService.confirm({
      nzTitle: modalTitle,
      nzContent: modaDescription,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.projectService
          .softDelete(id, isDeleted)
          .pipe(takeUntil(this._destroying$))
          .subscribe({
            next: () => {
              const notificationTitle =
                isDeleted === 'Y'
                  ? NOTIFICATION_TITLE.SoftDeleteSuccess.replace('{{1}}', 'Project')
                  : NOTIFICATION_TITLE.RestoreSuccess.replace('{{1}}', 'Project');
              const notificationDescription =
                isDeleted === 'Y'
                  ? NOTIFICATION_MESSAGE.SoftDeleteMessageSuccess.replace('{{1}}', 'project')
                  : NOTIFICATION_MESSAGE.RestoreMessageSuccess.replace('{{1}}', 'project');

              this.notificationService.create(
                'success',
                notificationTitle,
                notificationDescription,
                {
                  nzClass: 'form-notification',
                  nzDuration: 5000,
                },
              );
              this.updateTable();
              this.projectService.projectPublished();
            },
          });
      },
      nzCancelText: 'No',
    });
  }

  delete(id: number) {
    this.modalService.confirm({
      nzTitle: MODAL_TITLE.PermanentlyDeleteConfirmation.replace('{{1}}', 'Project'),
      nzContent: MODAL_DESCRIPTION.PermanentlyDeleteConfirmationMessage.replace('{{1}}', 'project'),
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.projectService
          .delete(id)
          .pipe(takeUntil(this._destroying$))
          .subscribe({
            next: () => {
              this.notificationService.create(
                'success',
                NOTIFICATION_TITLE.PermanentlyDeleteSuccess.replace('{{1}}', 'Project'),
                NOTIFICATION_MESSAGE.PermanentlyDeleteMessageSuccess.replace('{{1}}', 'project'),
                {
                  nzClass: 'form-notification',
                  nzDuration: 5000,
                },
              );
              this.updateTable();
              this.projectService.projectPublished();
            },
          });
      },
      nzCancelText: 'No',
    });
  }

  reset() {
    this.searchProjectForm.reset();
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
