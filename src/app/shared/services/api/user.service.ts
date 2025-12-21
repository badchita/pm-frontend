import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { User } from '@app/features/auth/models/user.model';
import { Observable } from 'rxjs';
import { TableUtilityService } from '../table-utility.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private tableUtilityService = inject(TableUtilityService);

  private api = `${environment.url}/users`;

  getSearchUsers(filters: any): Observable<User[]> {
    const params = this.tableUtilityService.buildParams(null, filters);

    return this.http.get<User[]>(`${this.api}/search`, { params });
  }
}
