import { I18nPluralPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { DataTable } from '@app/shared/models/data-table.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-task-list-table',
  imports: [
    NzTableModule,
    I18nPluralPipe,
    NzTagModule,
    NzIconModule,
    NzDividerModule,
    NzButtonModule,
  ],
  templateUrl: './task-list-table.component.html',
  styleUrl: './task-list-table.component.scss',
})
export class TaskListTableComponent {
  readonly dataTable = input.required<DataTable<any>>();
  readonly dataList = input.required<any[] | []>();
  readonly loading = input.required<boolean>();
}
