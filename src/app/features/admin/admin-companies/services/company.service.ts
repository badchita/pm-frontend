import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { TableUtilityService } from '@app/shared/services/table-utility.service';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly tableUtilityService = inject(TableUtilityService);

  private readonly api = `${environment.url}/companies`;

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.api}/${id}`);
  }

  update(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.api}/${company.id}`, company);
  }

  getList(tableParams?: TableParams, filters?: any): Observable<DataTable<Company>> {
    const params = this.tableUtilityService.buildParams(tableParams, filters);

    return this.http.get<DataTable<Company>>(`${this.api}`, { params });
  }

  softDelete(id: number, isDeleted: string): Observable<void> {
    const payload = { isDeleted: isDeleted };

    return this.http.put<void>(`${this.api}/${id}/isDeleted`, payload);
  }

  getSearchCompanies(filters: any): Observable<Company[]> {
    const params = this.tableUtilityService.buildParams(null, filters);

    return this.http.get<Company[]>(`${this.api}/search`, { params });
  }
}
