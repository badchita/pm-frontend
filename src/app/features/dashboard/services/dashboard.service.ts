import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { Observable } from 'rxjs';
import { Dashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.url}/dashboards`;

  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.api}`);
  }
}
