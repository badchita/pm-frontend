import { Component, inject, input, OnInit, output } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { Router } from '@angular/router';
import { Project } from '@app/features/projects/models/project.model';
import { DataTable } from '@app/shared/models/data-table.model';
import { DatePipe, I18nPluralPipe } from '@angular/common';
import { debounceTime } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { GenericUtilityService } from '@app/shared/services/generic-utility.service';
import { StatusOptions } from '@app/shared/enums/search.enum';
import { NzTagModule } from 'ng-zorro-antd/tag';

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
  ],
  templateUrl: './project-list-table.component.html',
  styleUrl: './project-list-table.component.scss',
})
export class ProjectListTableComponent implements OnInit {
  readonly dataTable = input.required<DataTable<Project>>();
  readonly dataList = input.required<Project[] | []>();
  readonly loading = input.required<boolean>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private genericUtilityService = inject(GenericUtilityService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  searchProjectForm!: FormGroup;

  showTooltipDescription = false;
  statusOptions = this.genericUtilityService.objectToArray(StatusOptions);

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
    const filter: NzTableQueryParams['filter'] = [{ ...searchFormValues }];

    const tableParams: NzTableQueryParams = {
      pageIndex: isFiltering ? 1 : params?.pageIndex ?? this.dataTable().page,
      pageSize: params?.pageSize ?? this.dataTable().pageSize,
      sort: params?.sort ?? [],
      filter: filter,
    };

    this.onUpdateTable.emit(tableParams);
  }

  reset() {
    this.searchProjectForm.reset();
  }
}
