import { Component, inject, input, output } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { Router } from '@angular/router';
import { Project } from '@app/shared/models/project.model';
import { DataTable } from '@app/shared/models/data-table.model';
import { I18nPluralPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list-table',
  imports: [
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule,
    NzTooltipModule,
    I18nPluralPipe,
  ],
  templateUrl: './project-list-table.component.html',
  styleUrl: './project-list-table.component.scss',
})
export class ProjectListTableComponent {
  readonly dataTable = input.required<DataTable<Project>>();
  readonly dataList = input.required<Project[] | []>();
  readonly isLoading = input.required<Subscription>();
  readonly onUpdateTable = output<NzTableQueryParams>();

  private router = inject(Router);

  showTooltipDescription = false;

  checkOverflow(el: HTMLElement) {
    this.showTooltipDescription = el.scrollWidth > el.clientWidth;
  }

  edit(id: number) {
    this.router.navigate([`/portal/projects/${id}`]);
  }

  updateTable(tableParams: NzTableQueryParams) {
    console.log(tableParams);
    this.onUpdateTable.emit(tableParams);
  }
}
