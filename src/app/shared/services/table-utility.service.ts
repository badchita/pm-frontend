import { Injectable } from '@angular/core';
import { TableParams } from '../models/data-table.model';
import { HttpParams } from '@angular/common/http';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableUtilityService {
  public buildParams(tableParams?: TableParams | null, filters?: any): HttpParams {
    let params = new HttpParams();

    if (tableParams) {
      params = params.set('page', encodeURIComponent(tableParams.page));
      params = params.set('pageSize', encodeURIComponent(tableParams.pageSize));
      params = params.set('sortDirection', encodeURIComponent(tableParams.sortDirection));
    }

    if (filters) {
      console.log(filters)
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
              // if (value instanceof Date) {
              //   params = params.set(key, format(value, DATE_FORMAT.ISO_DATE));
              // }
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
