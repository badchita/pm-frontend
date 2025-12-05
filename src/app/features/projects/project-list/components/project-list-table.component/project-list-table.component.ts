import { Component, inject, input, OnInit, output } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { Router } from '@angular/router';
import { Project } from '@app/shared/models/project.model';
import { DataTable } from '@app/shared/models/data-table.model';
import { DatePipe, I18nPluralPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

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
  ],
  templateUrl: './project-list-table.component.html',
  styleUrl: './project-list-table.component.scss',
})
export class ProjectListTableComponent implements OnInit {
  readonly dataTable = input.required<DataTable<Project>>();
  readonly dataList = input.required<Project[] | []>();
  readonly isLoading = input.required<Subscription>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private formBuilder = inject(FormBuilder);

  private router = inject(Router);

  showTooltipDescription = false;

  searchProjectForm!: FormGroup;

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchProjectForm = this.formBuilder.group({
      search: [null],
      dueDate: [null],
    });

    this.searchProjectForm.get('search')?.valueChanges.subscribe(() => {
      this.updateTable();
    });

    this.searchProjectForm.get('dueDate')?.valueChanges.subscribe(() => {
      this.updateTable();
    });
  }

  checkOverflow(el: HTMLElement) {
    this.showTooltipDescription = el.scrollWidth > el.clientWidth;
  }

  edit(id: number) {
    this.router.navigate([`/portal/projects/${id}`]);
  }

  updateTable(params?: NzTableQueryParams) {
    const filter: NzTableQueryParams['filter'] = [{ ...this.searchProjectForm.getRawValue() }];

    const tableParams: NzTableQueryParams = {
      pageIndex: params?.pageIndex ?? this.dataTable().page,
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
