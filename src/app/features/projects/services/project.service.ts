import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { Project, ProjectForm } from '@app/shared/models/project.model';
import { TableUtilityService } from '@app/shared/services/table-utility.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private tableUtilityService = inject(TableUtilityService);
  private api = `${environment.url}/projects`;

  create(project: ProjectForm): Observable<Project> {
    return this.http.post<Project>(`${this.api}`, project);
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.api}/${id}`);
  }

  update(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.api}/${project.id}`, project);
  }

  getList(tableParams: TableParams, filters: any): Observable<DataTable<Project>> {
    const params = this.tableUtilityService.buildParams(tableParams, filters);

    return this.http.get<DataTable<Project>>(`${this.api}`, { params });
  }

  publish(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.api}/${project.id}/publish`, project);
  }
}
