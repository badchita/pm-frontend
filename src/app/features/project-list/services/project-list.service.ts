import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectListService {
  private http = inject(HttpClient);
  private api = `${environment.url}/projects`;

  create(project: any): Observable<any> {
    return this.http.post<any>(`${this.api}`, project);
  }
}
