import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { User } from '@app/features/auth/models/user.model';
import { Observable } from 'rxjs';
import { TableUtilityService } from '../table-utility.service';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly tableUtilityService = inject(TableUtilityService);

  private readonly api = `${environment.url}/users`;

  getSearchUsers(filters: any): Observable<User[]> {
    const params = this.tableUtilityService.buildParams(null, filters);

    return this.http.get<User[]>(`${this.api}/search`, { params });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.api}/${user.id}`, user);
  }

  getList(tableParams?: TableParams, filters?: any): Observable<DataTable<User>> {
    const params = this.tableUtilityService.buildParams(tableParams, filters);

    return this.http.get<DataTable<User>>(`${this.api}`, { params });
  }

  softDelete(id: number, isDeleted: string): Observable<void> {
    const payload = { isDeleted: isDeleted };

    return this.http.put<void>(`${this.api}/${id}/isDeleted`, payload);
  }
}
