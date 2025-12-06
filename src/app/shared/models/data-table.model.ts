import { NzTableSortOrder } from 'ng-zorro-antd/table';

export class TableParams {
  search?: string;
  isPublished?: string;
  sort?: {
    key: string;
    value: NzTableSortOrder;
  }[];
  page = 0;
  pageSize = 10;
  sortDirection = 'desc';
}

export interface DataTable<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
