import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { Project, ProjectForm } from '@app/features/projects/models/project.model';
import { TableUtilityService } from '@app/shared/services/table-utility.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly tableUtilityService = inject(TableUtilityService);
  private readonly api = `${environment.url}/projects`;
  private readonly _projectPublished$ = new Subject<void>();

  projectPublished$ = this._projectPublished$.asObservable();

  create(project: ProjectForm): Observable<Project> {
    return this.http.post<Project>(`${this.api}`, project);
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.api}/${id}`);
  }

  update(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.api}/${project.id}`, project);
  }

  getList(tableParams?: TableParams, filters?: any): Observable<DataTable<Project>> {
    const params = this.tableUtilityService.buildParams(tableParams, filters);

    return this.http.get<DataTable<Project>>(`${this.api}`, { params });
  }

  publish(id: number, isPublished: string, project: Project): Observable<Project> {
    if (isPublished === 'N') {
      return this.http.put<Project>(`${this.api}/${id}/publish`, project);
    } else {
      return this.http.put<Project>(`${this.api}/${id}/unpublish`, {});
    }
  }

  softDelete(id: number, isDeleted: string): Observable<void> {
    const payload = { isDeleted: isDeleted };

    return this.http.put<void>(`${this.api}/${id}/isDeleted`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  projectPublished() {
    this._projectPublished$.next();
  }
}
