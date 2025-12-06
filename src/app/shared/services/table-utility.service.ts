import { Injectable } from '@angular/core';
import { TableParams } from '../models/data-table.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TableUtilityService {
  public buildParams(tableParams?: TableParams | null, filters?: any): HttpParams {
    let params = new HttpParams();

    if (tableParams) {
      params = params.set('page', encodeURIComponent(tableParams.page));
      params = params.set('pageSize', encodeURIComponent(tableParams.pageSize));

      if (tableParams.sort?.length) {
        const activeSort = tableParams.sort.find((s) => s.value);

        if (activeSort && activeSort.value) {
          const direction = activeSort.value.replace('end', '');

          params = params.set('sortBy', activeSort.key);
          params = params.set('sortDirection', direction);
        }
      }
    }

    if (filters) {
      Object.keys(filters).forEach((key) => {
        let value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
          switch (typeof value) {
            case 'boolean':
            case 'number': {
              params = params.set(key, value.toString());
              break;
            }
            case 'string': {
              value = value.trim();
              params = params.set(key, value);
              break;
            }
            default: {
              if (value instanceof Date) {
                params = params.set(key, value.toISOString());
              }
              if (value instanceof Array) {
                value.forEach((item) => (params = params.append(key, item)));
              }
            }
          }
        }
      });
    }

    return params;
  }

  public changePage(tableData: any[], page: number, pageSize: number): any[] {
    return [...tableData].slice(page ? (page - 1) * pageSize : 0, pageSize * page);
  }
}
