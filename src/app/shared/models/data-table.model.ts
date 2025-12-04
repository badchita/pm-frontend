export class TableParams {
  search?: string;
  isPublished?: string;
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
