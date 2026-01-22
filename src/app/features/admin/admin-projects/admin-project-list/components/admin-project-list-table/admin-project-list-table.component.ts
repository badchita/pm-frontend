import { I18nPluralPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '@app/features/admin/admin-companies/services/company.service';
import { Project } from '@app/features/projects/models/project.model';
import { ProjectService } from '@app/features/projects/services/project.service';
import {
  MODAL_DESCRIPTION,
  MODAL_TITLE,
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TITLE,
} from '@app/shared/constants/ui.constants';
import { StatusOptions } from '@app/shared/enums/search.enum';
import { DataTable } from '@app/shared/models/data-table.model';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectItemInterface, NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-project-list-table',
  imports: [
    NzTableModule,
    NzIconModule,
    NzDividerModule,
    I18nPluralPipe,
    NzButtonModule,
    NzTagModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzModalModule,
    NzTooltipModule,
    NzModalModule,
  ],
  templateUrl: './admin-project-list-table.component.html',
  styleUrl: './admin-project-list-table.component.scss',
})
export class AdminProjectListTableComponent implements OnInit, OnDestroy {
  readonly dataTable = input.required<DataTable<Project>>();
  readonly dataList = input.required<Project[] | []>();
  readonly loading = input.required<boolean>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private readonly companyService = inject(CompanyService);
  private readonly projectService = inject(ProjectService);
  private readonly genericUtilityService = inject(GenericUtilityService);
  private readonly modalService = inject(NzModalService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly _destroying$ = new Subject<void>();

  searchProjectForm!: FormGroup;
  companies!: { label: string; value: number }[];
  disableFilter: (input: string, option: NzSelectItemInterface) => boolean = () => true;

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
      companyId: [null],
      isPublished: [null],
    });

    this.searchProjectForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.updateTable());

    this.searchProjectForm
      .get('companyId')
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
    this.router.navigate([`/portal/admin/projects/${id}`]);
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

  loadCompanies(searchValue: string) {
    this.companyService
      .getSearchCompanies({ search: searchValue })
      .pipe(takeUntil(this._destroying$))
      .subscribe({
        next: (companies) => {
          this.companies = companies.map((company) => ({
            label: company.name,
            value: company.id,
          }));
        },
      });
  }

  recycleBin(event: MouseEvent, isOpen = 'N') {
    event.stopPropagation();
    this.isDeleted = isOpen;
    if (isOpen === 'Y') {
      this.router.navigate([`/portal/admin/projects`], { queryParams: { isDeleted: 'Y' } });
    } else {
      this.router.navigate([`/portal/admin/projects`]);
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
